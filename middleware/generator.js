const moment = require('moment');
const otpGenerator = require('otp-generator');

const { convertDate, dateNow, convertDateTime } = require('./convertdate');
const { decryptText, encryptText } = require('./encrypt');

const { Customer } = require('../models/masters/customer-mdl');
const { CustomerPo,NoPo } = require('../models/transactions/customer-po-mdl');

Number.prototype.pad = function(size) {
  let s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

async function genKodeCustomer() {
  let strKodeCustomer;

  try{
    let customer = await Customer.aggregate([
      { "$match": { kode_customer : new RegExp(encryptText("AMG")) }},
      { "$sort": { "input_date": -1 }},
      { "$limit": 1 }
    ]);
    
    if(customer.length == 0) {
      strKodeCustomer = "AMG" + Number(1).pad(8); 
    }else{
      strKodeCustomer = "AMG" + Number(Number(String(decryptText(customer[0].kode_customer)).slice(3,11)) + 1).pad(8);
    }
    
    for (let lcustomer = await Customer.findOne({ kode_customer: encryptText(strKodeCustomer) }); lcustomer; lcustomer = await Customer.findOne({ kode_customer: encryptText(strKodeCustomer) })) {
      strKodeCustomer = "AMG" + Number(Number(String(decryptText(lcustomer.kode_customer)).slice(3,11)) + 1).pad(8);
    }
  
    return [200, strKodeCustomer];
  }catch(err){
    return [400, ERR.message];
  }
}

async function genNoPo(tanggal) {

  try{
    let strNoPo;
    
    let noPo = await NoPo.findOne({ tgl_po: new Date(convertDate(tanggal)) })
    if (!noPo) {
      strNoPo = "PO-" + moment(tanggal).format('YYMMDD') + "-0001";
    }else{
      strNoPo = "PO-" + moment(tanggal).format('YYMMDD') + Number(Number(String(decryptText(noPo.no_po)).slice(10,14)) + 1).pad(4);
    }
    
    for(i = 1; i <= 50; i++) {
      noPo = await NoPo.findOne({ no_po: encryptText(strNoPo) });
      if (!noPo){
        break;
      }else{
        strNoPo = "PO-" + moment(tanggal).format('YYMMDD') + Number(Number(String(decryptText(noPo.no_po)).slice(10,14)) + 1).pad(4);
      }
    };

    return [200, strNoPo];
  }catch(err){
    return [500, err.message];
  }
}

async function genNoPoNew(tanggal) {

  let strNoPoNew;

  try{
    let custPo = await CustomerPo.aggregate([
      { "$match": { tgl_po : new Date(convertDate(tanggal)) }},
      { "$sort": { "input_date": -1 }},
      { "$limit": 1 }
    ]);
    
    if(custPo.length == 0) {
      strNoPoNew = "PO-" + moment(tanggal).format('YYMMDD') + Number(1).pad(4)
    }else{
      strNoPoNew = "PO-" + moment(tanggal).format('YYMMDD') + Number(Number(String(decryptText(custPo[0].no_po)).slice(9,13)) + 1).pad(4);
    }
    
    for (let lcustPo = await CustomerPo.findOne({ no_po: encryptText(strNoPoNew) }); lcustPo; lcustPo = await CustomerPo.findOne({ no_po: encryptText(strNoPoNew) })) {
      strNoPoNew = "PO-" + moment(tanggal).format('YYMMDD') + Number(Number(String(decryptText(lcustPo.no_po)).slice(9,13)) + 1).pad(4);
    }
  
    return [200, strNoPoNew];
  }catch(err){
    return [400, ERR.message];
  }
}

function genKodeOTP() {
  try{
    const strOTP = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });
    return [200, strOTP];
  }catch(err){
    return [500, err.message];
  }
}

exports.genKodeCustomer = genKodeCustomer;
exports.genNoPo = genNoPo;
exports.genNoPoNew = genNoPoNew;
exports.genKodeOTP = genKodeOTP;
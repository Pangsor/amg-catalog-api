const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON,
  maskedNumber,
  unMaskedNumber
} = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');
const { sendEmail,sendEmailOTP } = require('../../middleware/email');
const { genKodeCustomer,genKodeOTP } = require('../../middleware/generator');

const { 
  Customer,
  validateUserLogin,
  fieldsCustomer
} = require('../../models/masters/customer-mdl');

const { 
  OtpCustomer, 
  validateVerifikasiOTP,
  OtpCustomerNoHp
} = require('../../models/temporary/customer-otp-mdl');

const { Item } = require('../../models/masters_line/item-mdl');
const { CustomerView,fieldsCustomerView } = require('../../models/transactions/customer-view-mdl');

async function addCustomer(session, dataUser, dataBody) {
  const resGenKode = await genKodeCustomer();
  if  (resGenKode[0] !== 200) return resGenKode;
  const kodeCustomer = resGenKode[1];

  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let customer = await Customer.findOne({ "user.user_id":encBody.user_id });
  if (customer) return [400,`User Id sudah terdaftar!`];

  customer = await Customer.findOne({ "user.email":encBody.email });
  if (customer) return [400,`Email sudah digunakan customer lain!`];

  customer = new Customer({
    "kode_customer": encryptText(kodeCustomer),
    "nama_customer": encBody.nama_customer,
    "nama_owner": encBody.nama_owner,
    "negara": encBody.negara,
    "provinsi": encBody.provinsi,
    "kota": encBody.kota,
    "area": encBody.area,
    "alamat": encBody.alamat,
    "user": [{
      "user_id": encBody.user_id,
      "nama_user": encBody.nama_user,
      "email": encBody.email,
      "password": encBody.password,
      "level": encBody.level
    }],
    "kontak": encBody.kontak,
    "status": encryptText("OPEN"),
    "isactive": maskedNumber(1)
  });
  
  const salt = await bcrypt.genSalt(10);
  customer.user[0].password = await bcrypt.hash(customer.user[0].password, salt);

  await customer.save({ session: session });
  
  return [200, 'Data Customer berhasil disimpan.'];
  
}

// Register
async function registerCustomer(session, dataUser, dataBody) {
  const resGenKode = await genKodeCustomer();
  if  (resGenKode[0] !== 200) return resGenKode;
  const kodeCustomer = resGenKode[1];
  
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let customer = await Customer.findOne({ "user.user_id":encBody.user_id });
  if (customer) return [400,`User Id already in use!`];

  customer = await Customer.findOne({ "user.email":encBody.email });
  if (customer) return [400,`Email is already in use!`];

  customer = new Customer({
    "kode_customer": encryptText(kodeCustomer),
    "nama_customer": encBody.nama_customer,
    "nama_owner": encBody.nama_owner,
    "negara": encBody.negara,
    "provinsi": encBody.provinsi,
    "kota": encBody.kota,
    "area": encBody.area,
    "alamat": encBody.alamat,
    "user": [{
      "user_id": encBody.user_id,
      "nama_user": encBody.nama_user,
      "email": encBody.email,
      "password": encBody.password,
      "level": encBody.level
    }],
    "kontak": encBody.kontak,
    "status": encryptText("OPEN"),
    "isactive": maskedNumber(1)
  });
  
  const salt = await bcrypt.genSalt(10);
  customer.user[0].password = await bcrypt.hash(customer.user[0].password, salt);
  
  await customer.save({ session: session });
  
  sendEmail({
    kode_customer: kodeCustomer,
    nama_lkp: decryptText(encBody.nama_customer),
    email: decryptText(encBody.email)
  }).catch(error => {
    console.log(error);
  });

  return [200, 'Registration is successful! Please check email for verification.'];
  
}

// Verifikasi Email
async function aktivasiEmail(dataParams) {
  
  try {
    const decoded = jwt.verify(dataParams.token, config.get('jwtPrivateKey'));

    let customer = await Customer.findOneAndUpdate({ kode_customer: encryptText(decoded.kode_customer), "user.email": encryptText(decoded.email) },{
      status: encryptText("VERIFIED")
    });

    if(!customer) [404, "Invalid customer data, account activation failed !"];

    return [200, 'success.'];
  }
  catch (ex) {
    return [400, 'Invalid Token Activation!'];
  }
}

// Validasi 
async function validasiCustomer(dataParams) {

  let customer = await Customer.findOneAndUpdate({ kode_customer: encryptText(dataParams.kode_customer) },
    {
      status: encryptText("VALID")
  });

  if (!customer) return [404, `Customer not found!`];

  return [200, "customer data was successfully validated!"];
}

async function addUser(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let cust01 = await Customer.findOne({ "user.user_id":encBody.user_id });
  if (cust01) return [400,`User Id already in use!`];

  cust01 = await Customer.findOne({ "user.email":encBody.email });
  if (cust01) return [400,`Email is already in use!`];

  let customer = await Customer.findOneAndUpdate({ kode_customer: encryptText(dataParams.kode_customer) },
    {
      "$push":{
        user:{
          "user_id": encBody.user_id,
          "nama_user": encBody.nama_user,
          "email": encBody.email,
          "password": encBody.password,
          "level": encBody.level
        }
      }
      
  },{ session: session });
  
  if (!customer) return [404, `Customer not found!`];

  return [200, "Added user saved successfully!"];
}

async function editCustomer(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let customer = await Customer.findOne({ "user.user_id":encryptText(dataParams.user_id) });
  if (!customer) return [404, `User ID not found!`];

  customer.user[0].nama_user = encBody.nama_user;
  customer.user[0].email = encBody.email;
  customer.alamat = encBody.alamat;
  customer.kontak = encBody.kontak;

  await customer.save({ session: session });

  return [200,{
    "user_id" : dataParams.user_id,
    "kode_customer" : decryptText(customer.kode_customer),
    "nama_customer" : decryptText(customer.nama_customer),
    "email": decryptText(customer.user[0].email),
    "kontak": decryptText(customer.kontak),
    "alamat": decryptText(customer.alamat),
    "nama_user": decryptText(customer.user[0].nama_user)
  }];
}

async function nonActiveCustomer(session,dataParams) {

  let customer = await Customer.findOneAndUpdate({ kode_customer: encryptText(dataParams.kode_customer) },
    {
      isactive: maskedNumber(0)
  }, { session: session });

  if (!customer) return [404, `Customer not found!`];

  return [200, "Customer data has been successfully disabled!"];
}

async function activeCustomer(session,dataParams) {
  let customer = await Customer.findOneAndUpdate({ kode_customer: encryptText(dataParams.kode_customer) },
    {
      isactive: maskedNumber(1)
  }, { session: session });

  if (!customer) return [404, `Customer not found!`];

  return [200, "Customer data has been activated successfully!"];
}

async function deleteCustomer(session, dataUser, dataParams) {

  const customer = await Customer.findOneAndRemove({
    kode_customer: encryptText(dataParams.kode_customer)
  }, { session: session });
  if (!customer) return [404, `Data Customer tidak di temukan!`];
  
  return [200, "Customer successfully deleted!"];
}


async function getCustomer() {
  let customer = await Customer.aggregate([
    { '$project': fieldsCustomer }
  ]);

  let resDec = decryptJSON(customer);
  return resDec;
}

// Ambil Email Yang Sudah Terverifikasi
async function getCustomerVerified() {
  let customer = await Customer.aggregate([
    { "$match": { "status": encryptText("VERIFIED") }},
    { '$project': fieldsCustomer }
  ]);

  let resDec = decryptJSON(customer);
  return resDec;
}

// Customer Yang Sudah Di Validasi
async function getCustomerValid() {
  let customer = await Customer.aggregate([
    { "$match": { "status": encryptText("VALID") }},
    { '$project': fieldsCustomer }
  ]);

  let resDec = decryptJSON(customer);
  return resDec;
}

async function getCustomer2() {
  let customer = await Customer.aggregate([
    { '$project': {
      "kode_customer":"$kode_customer",
      "nama_customer":"$nama_customer",
      "user.user_id":"$user.user_id",
    } }
  ]);

  let resDec = decryptJSON(customer);
  return resDec;
}

async function loginUser(dataBody) {
  let tmpIsActive = 0;

  let customer = await Customer.findOne({
     "user.user_id": encryptText(dataBody.user_id),
     status: encryptText('VALID')
  });

  if (!customer){
    return [400, `Invalid user or password !`];
  }

  tmpIsActive=unMaskedNumber(customer.isactive);
  if (tmpIsActive === 0){
    return [400, `Your account is being suspended, please contact the admin for more info !`];
  }
  
  let statusLogin = "email";
  let sendOTPMessage = `The OTP code has been sent to the email : ${decryptText(customer.user[0].email)}`;
  
  const validPassword = await bcrypt.compare(encryptText(dataBody.password), customer.user[0].password);

  if (!validPassword){
    return [400, `Invalid user or password !`];
  }

  const token = customer.generateAuthToken();
  const kodeOTP = genKodeOTP();
  if (kodeOTP[0] !== 200) return kodeOTP;

  let otpCustomer = await OtpCustomer.findOneAndDelete({ user_id: encryptText(dataBody.user_id) });
  otpCustomer = new OtpCustomer({
    kode_otp: encryptText(String(kodeOTP[1])),
    email: customer.user[0].email,
    user_id: encryptText(dataBody.user_id),
    token: encryptText(token),
    send_otp: encryptText(statusLogin),
    count: maskedNumber(1)
  });
  await otpCustomer.save();

  if(statusLogin === "email"){
    sendEmailOTP({
      nama_lkp: decryptText(customer.nama_customer),
      email: decryptText(customer.user[0].email),
      kode_otp: kodeOTP[1]
    }).catch(error => {
      console.log(error);
    });
  } else {
    
  }

  return [200,{
    "token" : token,
    "user_id" : decryptText(customer.user[0].user_id),
    "kode_customer" : decryptText(customer.kode_customer),
    "nama_customer" : decryptText(customer.nama_customer),
    "email": decryptText(customer.user[0].email),
    "kontak": decryptText(customer.kontak),
    "alamat": decryptText(customer.alamat),
    "nama_user": decryptText(customer.user[0].nama_user),
    "negara": decryptText(customer.negara)
  }];

};

// Validate Kode OTP
async function validateOTP(dataParams, dataBody) {
  const { error } = validateVerifikasiOTP(dataBody);
  if(error) return [400, error.details[0].message];

  let otpCustomer = await OtpCustomer.findOne({ email: encryptText(dataParams.email), kode_otp: encryptText(dataBody.kode_otp) });
  if(!otpCustomer) return [404, "Invalid OTP code!"];

  return [200, [{
    token: decryptText(otpCustomer.token)
  }]];
}

// Resend Kode OTP
async function reSendKodeOtp(dataParams) {
  let otpCustomer = await OtpCustomer.findOne({ email: encryptText(dataParams.email) });
  if(!otpCustomer) return [404, "Invalid OTP code!"];

  let customer = await Customer.findOne({ "user.email": otpCustomer.email });
  if (!customer) return [404, "Invalid customer data!"];

  let strEmail;

  let sendOTPMessage = `The OTP code has been sent to the email : ${decryptText(customer.user[0].email)}`;
  
  if(decryptText(otpCustomer.send_otp) === "email"){
    sendEmailOTP({
      nama_lkp: decryptText(customer.nama_customer),
      email: decryptText(customer.user[0].email),
      kode_otp: decryptText(otpCustomer.kode_otp)
    }).catch(error => {
      console.log(error);
    });
  } else {
    
  }

  return [200,{
    "kode_customer" : decryptText(customer.kode_customer),
    "nama_customer" : decryptText(customer.nama_customer),
    "email": decryptText(customer.user[0].email),
    "kontak": decryptText(customer.kontak)
  }, sendOTPMessage ];

}

// Resend Kode OTP (Forget Password)
async function reSendKodeOtp2(dataBody) {
  let otpCustomer = await OtpCustomer.findOne({ email: encryptText(dataBody.email) });
  if(!otpCustomer) return [404, "Invalid OTP code!"];

  let customer = await Customer.findOne({ "user.email": otpCustomer.email });
  if (!customer) return [404, "Invalid customer data!"];

  let strEmail;

  let sendOTPMessage = `The OTP code has been sent to the email : ${decryptText(customer.user[0].email)}`;
  
  if(decryptText(otpCustomer.send_otp) === "email"){
    sendEmailOTP({
      nama_lkp: decryptText(customer.nama_customer),
      email: decryptText(customer.user[0].email),
      kode_otp: decryptText(otpCustomer.kode_otp)
    }).catch(error => {
      console.log(error);
    });
  } else {
    
  }

  return [200,{
    "user_id" : decryptText(customer.user[0].user_id),
    "kode_customer" : decryptText(customer.kode_customer),
    "nama_customer" : decryptText(customer.nama_customer),
    "email": decryptText(customer.user[0].email),
    "kontak": decryptText(customer.kontak),
    "alamat": decryptText(customer.alamat),
    "nama_user": decryptText(customer.user[0].nama_user),
    "negara": decryptText(customer.negara)
  }, sendOTPMessage ];

}

async function changePassword(session, dataUser,dataParams, dataBody) {
  
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  // if (encBody.password === encBody.new_password) return [400,`Password baru tidak boleh sama dengan password lama!`];
  // if (encBody.new_password !== encBody.retype_password) return [400,`Password baru dengan retype-password tidak sama!`];

  let customer = await Customer.findOne({ "user.user_id": encryptText(dataParams.user_id) });
  if (!customer) return [404, `User id not found!`];

  // const validPassword = await bcrypt.compare(encBody.password, customer.password);
  // if (!validPassword) return [400, `Password lama salah!`];

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(encBody.new_password, salt);

  let customer02 = await Customer.findOne({ "user.user_id":encryptText(dataParams.user_id) });
  if (!customer02) return [404, `User id not found!`];

  customer02.user[0].password = newPassword;

  await customer02.save({ session: session });

  return [200, "Password has been changed!"];
}

// View Products
async function addViewProduct(session, dataParams){
  let totalView = 0;
  let totalView2 = 0;
  let tmpTotalView = 0;
  let ketCust = "";

  const resEnc = encryptJSON(dataParams);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  // Cek Customer
  let customer = await Customer.findOne({
    kode_customer:encBody.kode_customer
  });
  if (!customer) return [400, `Customer not found`];

  // Cek Item
  let item =await Item.findOne({
    code_item:encBody.code_item
  });
  if (!item) return [400,`Item not found`]

  const itemDetail2 = ({
    "code_item": encBody.code_item,
    "total_view": maskedNumber(1)
  });

  // Cek Customer
  let custView01 = await CustomerView.findOne({
    kode_customer:encBody.kode_customer  
  });
  if (!custView01){
    ketCust = "TIDAK ADA";
  }else{
    ketCust = "ADA";
    tmpTotalView = unMaskedNumber(custView01.total);
  }

  let custView02 = await CustomerView.findOne({
    kode_customer:encBody.kode_customer,
    "itemdetail.code_item":encBody.code_item  
  });
  if (!custView02){
    if (ketCust === "TIDAK ADA"){
      custView03 = new CustomerView({
        "kode_customer":encBody.kode_customer,
        "total":maskedNumber(1),
        "itemdetail":itemDetail2
      });
  
      await custView03.save({ session: session });
    }else{
      // return [400, tmpTotalView]
      let custView03 = await CustomerView.findOneAndUpdate({ kode_customer: encBody.kode_customer },
        {
          "$push":{
            itemdetail:{
              "code_item": encBody.code_item,
              "total_view": maskedNumber(1)
            }
          }
        },{ session: session });

      // Update Total Header
      totalView2 = Number(tmpTotalView) + 1;
  
      let custView04 = await CustomerView.findOneAndUpdate({
        "kode_customer": encBody.kode_customer
      },{
        "total": maskedNumber(totalView2)
      },{ session:session});
      // End Update Total Header
    }
    
  }else{

    const objIndex = custView02.itemdetail.findIndex(obj => obj.code_item == encBody.code_item);
    
    totalView =  unMaskedNumber(custView02.itemdetail[objIndex].total_view);
    totalView = Number(totalView) + 1;
    totalView2 = unMaskedNumber(custView02.total)
    totalView2 = Number(totalView2) + 1;
    
    custView02.itemdetail[objIndex].total_view = maskedNumber(totalView);
    custView02.total = maskedNumber(totalView2);
    await custView02.save({ session: session });
  }

  return [200, "Item successfully Viewed!"];

}

// Customer Aktif
async function customerAktif(dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  switch (dataBody.filter) {
    case "aktif":
        pipeLineAggregate.push({ "$sort": { total: -1 } });
        stsPage = true;
        break;
    default:
      return [400, "Status filter not found!"]
  }

  pipeLineAggregate.push(
    { "$lookup":
      {
        from: 'tm_customer',
        localField: 'kode_customer',
        foreignField: 'kode_customer',
        as: 'customer'
      }
    },
    { "$unwind": "$customer"}
  );

  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  pipeLineAggregate.push(
    { "$skip": Number(dataBody.value.limit_from) },
    { "$limit": Number(dataBody.value.limit_item) }
  );

  pipeLineAggregate.push({ "$project": {
    "kode_customer":"$kode_customer",
    "total":"$total",
    "nama_customer":"$customer.nama_customer",
    "negara":"$customer.negara"
  } })

  custView = await CustomerView.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(custView[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (custView[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], custView[0].count_detail[0].count_item]
  }

}

// Region Aktif
async function regionAktif(dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  switch (dataBody.filter) {
    case "aktif":
        pipeLineAggregate.push({ "$sort": { total: -1 } });
        stsPage = true;
        break;
    default:
      return [400, "Status filter not found!"]
  }

  pipeLineAggregate.push(
    { "$lookup":
      {
        from: 'tm_customer',
        localField: 'kode_customer',
        foreignField: 'kode_customer',
        as: 'customer'
      }
    },
    { "$unwind": "$customer"}
  );
  
  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  pipeLineAggregate.push(
    { "$skip": Number(dataBody.value.limit_from) },
    { "$limit": Number(dataBody.value.limit_item) }
  );

  pipeLineAggregate.push({ "$project": {
    "kode_customer":"$kode_customer",
    "total":"$total",
    "nama_customer":"$customer.nama_customer",
    "negara":"$customer.negara"
  } })

  custView = await CustomerView.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(custView[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (custView[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], custView[0].count_detail[0].count_item]
  }

}

exports.addCustomer = addCustomer;
exports.addViewProduct = addViewProduct;
exports.registerCustomer = registerCustomer;
exports.aktivasiEmail = aktivasiEmail;
exports.validasiCustomer = validasiCustomer;
exports.addUser = addUser;
exports.editCustomer = editCustomer;
exports.activeCustomer = activeCustomer;
exports.nonActiveCustomer = nonActiveCustomer;
exports.deleteCustomer = deleteCustomer;
exports.getCustomer = getCustomer;
exports.getCustomerVerified = getCustomerVerified;
exports.getCustomerValid = getCustomerValid;
exports.getCustomer2 = getCustomer2;
exports.loginUser = loginUser;
exports.validateOTP = validateOTP;
exports.reSendKodeOtp = reSendKodeOtp;
exports.reSendKodeOtp2 = reSendKodeOtp2;
exports.changePassword = changePassword;
exports.customerAktif = customerAktif;
exports.regionAktif = regionAktif;
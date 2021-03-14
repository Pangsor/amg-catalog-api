const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON,
  maskedNumber,
  unMaskedNumber
} = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');

const { cekNumber, trimUcaseJSON } = require('../../middleware/function');
const { genNoPo,genNoPoNew } = require('../../middleware/generator');
const { pipeline } = require('nodemailer/lib/xoauth2');
const { sendEmailPO } = require('../../middleware/email');

const { 
  TmpPo,
  fieldsTmpPo,
  validateTmpPoAdd,
  validateTmpPoEdit
} = require('../../models/temporary/customer-tmp-po-mdl');

const { 
  Customer
} = require('../../models/masters/customer-mdl');

const { 
  Item
} = require('../../models/masters_line/item-mdl');

const { 
  CustomerPo,
  NoPo,
  fieldsCustomerPo,
  validateCustomerPoEdit,
  fieldsCustomerPo2
} = require('../../models/transactions/customer-po-mdl');
const { date } = require('@hapi/joi');
const { Console } = require('winston/lib/winston/transports');

async function addToCart(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let tmpHslSem = 0;
  let tmpHslSem2 = 0;
  let tmpHsl = 0;
  let tmpNettWeight = 0;
  let tmpGrossWeight = 0;
  let subTotalKadar = 0;
  let subTotalPrice = 0;
  let totalKadarAwal = 0;
  let totalPriceAwal = 0;
  let totalKadar = 0;
  let totalPrice = 0;

  let tmpNamaCustomer = "";
  let tmpNegara = "";
  let tmpItemName = "";
  let tmpLokasiGambar = "";
  let tmpTypeKadar = "";
  let tmpStatusBrg = "";
  let tmpKadar = 0;
  let tmpPrice = 0;

  resCek = cekNumber("qty_po", dataBody.qty_po);
  if(resCek[0] !== 200) return resCek;

  let customer = await Customer.findOne({ kode_customer: encBody.kode_customer });
  if (!customer) return [400,`Customer not found!`];

  let item = await Item.findOne({ code_item: encBody.code_item, status_show: encryptText('VALID') });
  if (!item) return [400,`Item not found!`];

  // Cek Item Di Keranjang
  let tmpPo = await TmpPo.findOne({ 
    kode_customer:encBody.kode_customer,
    code_item: encBody.code_item,
    metal_title_code: encBody.metal_title_code
   });
  if (tmpPo) return [400,`Item has been added!`];

  let tmpPo2 = await TmpPo.findOne({ kode_customer:encBody.kode_customer });
  if (tmpPo2) {
    totalKadarAwal = unMaskedNumber(tmpPo2.total_kadar);
    totalPriceAwal = unMaskedNumber(tmpPo2.total_price);
  }

  tmpNamaCustomer = customer.nama_customer;
  tmpNegara = decryptText(customer.negara);
  tmpItemName = item.item_name;
  tmpLokasiGambar = item.gambar[0].lokasi_gambar;
  
  for (let i in item.material){
    if (decryptText(item.material[i].metal_title_code) === dataBody.metal_title_code){
      tmpStatusBrg = "VALID";
      tmpKadar = unMaskedNumber(item.material[i].kadar);
      tmpPrice = unMaskedNumber(item.material[i].price);
      tmpNettWeight = unMaskedNumber(item.material[i].total_nett_weight);
      tmpGrossWeight = unMaskedNumber(item.material[i].total_gross_weight);
      break;
    }
    tmpStatusBrg = "NOT VALID";
  }

  if (tmpStatusBrg === "NOT VALID"){
    return [400,`Metal title code not found`]
  }
  
  if (tmpNegara != "INDONESIA"){
    subTotalPrice = Number(tmpPrice) * Number(dataBody.qty_po);
    subTotalKadar = 0;
    tmpTypeKadar = "PRICE";
  }else{
    subTotalPrice = 0;
    tmpHslSem = (Number(tmpNettWeight) * Number(tmpKadar)) / 100;
    tmpHslSem2 = Number(Number(tmpHslSem).toFixed(2)) * Number(dataBody.qty_po);
    tmpHsl = Number(tmpHslSem2).toFixed(2);
    subTotalKadar = tmpHsl;
    tmpTypeKadar = "KADAR";
  }

  totalKadar = Number(totalKadarAwal) + Number(subTotalKadar);
  totalPrice = Number(totalPriceAwal) + Number(subTotalPrice);
  
  tmpPo = new TmpPo({
    "kode_customer": encBody.kode_customer,
    "nama_customer": tmpNamaCustomer,
    "code_item": encBody.code_item,
    "item_name": tmpItemName,
    "lokasi_gambar": tmpLokasiGambar,
    "metal_title_code":encBody.metal_title_code,
    "type_kadar": encryptText(tmpTypeKadar),
    "kadar": maskedNumber(tmpKadar),
    "price": maskedNumber(tmpPrice),
    "total_nett_weight": maskedNumber(tmpNettWeight),
    "total_gross_weight": maskedNumber(tmpGrossWeight),
    "qty_po": encBody.qty_po,
    "sub_total_kadar": maskedNumber(subTotalKadar),
    "sub_total_price": maskedNumber(subTotalPrice),
    "total_kadar":maskedNumber(0),
    "total_price":maskedNumber(0),
    "notes":encBody.notes,
    "input_by":dataUser.user_id,
    "input_date":dateNow()
  });
  
  await tmpPo.save({ session: session });
  
  let tmpTotalPo =  await TmpPo.updateMany({
    kode_customer: encBody.kode_customer},
    {
      total_kadar: maskedNumber(totalKadar),
      total_price: maskedNumber(totalPrice)
    },{session:session});

  return [200, "Item successfully added!"]; 
}

async function editCart(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let tmpHslSem = 0;
  let tmpHslSem2 = 0;
  let tmpHsl = 0;
  let subTotalKadar = 0;
  let subTotalPrice = 0;
  let totalKadar = 0;
  let totalPrice = 0;

  let tmpTypeKadar ="";
  let tmpKadar = 0;
  let tmpPrice = 0;
  let tmpNettWeight = 0;

  resCek = cekNumber("qty_po", dataBody.qty_po);
  if(resCek[0] !== 200) return resCek;

  let cart01 = await TmpPo.findOne({
     kode_customer: encryptText(dataParams.kode_customer),
     code_item: encryptText(dataParams.code_item),
     metal_title_code: encryptText(dataBody.metal_title_code)
    });
  if (!cart01) return [400,`Item not found!`];

  tmpTypeKadar = decryptText(cart01.type_kadar);
  tmpKadar = unMaskedNumber(cart01.kadar);
  tmpPrice = unMaskedNumber(cart01.price);
  tmpNettWeight = unMaskedNumber(cart01.total_nett_weight);

  if (tmpTypeKadar === "PRICE"){
    subTotalPrice = Number(tmpPrice) * Number(dataBody.qty_po);
    subTotalKadar = 0;
  }else{
    subTotalPrice = 0;
    tmpHslSem = (Number(tmpNettWeight) * Number(tmpKadar)) / 100;
    tmpHslSem2 = Number(Number(tmpHslSem).toFixed(2)) * Number(dataBody.qty_po);
    tmpHsl = Number(tmpHslSem2).toFixed(2);
    subTotalKadar = tmpHsl;
  }

  let cart = await TmpPo.findOneAndUpdate({ 
    kode_customer: encryptText(dataParams.kode_customer),
    code_item: encryptText(dataParams.code_item),
    metal_title_code: encryptText(dataBody.metal_title_code)
  },
    {
      qty_po: encBody.qty_po,
      sub_total_kadar:maskedNumber(subTotalKadar),
      sub_total_price:maskedNumber(subTotalPrice),
      notes : encBody.notes
  },{ new:true });

  if (!cart) return [404, `Item not found!`];

  let cart02 = await TmpPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer) }},
    { '$project': {
      "sub_total_kadar":"$sub_total_kadar",
      "sub_total_price":"$sub_total_price"
    } }
  ]);

  for (let c in cart02){
      totalKadar = Number(totalKadar);
      totalPrice = Number(totalPrice) + Number(unMaskedNumber(cart02[c].sub_total_price));
  }

  let tmpTotalPo =  await TmpPo.updateMany({
  kode_customer: encryptText(dataParams.kode_customer)},
  {
    total_kadar: maskedNumber(totalKadar),
    total_price: maskedNumber(totalPrice)
  },{session:session});

  console.log(totalPrice);
  return [200, "Item was successfully edited!"];
}

async function deleteCart(session, dataUser, dataParams) {
  const cart = await TmpPo.findOneAndRemove({
    kode_customer: encryptText(dataParams.kode_customer),
    code_item: encryptText(dataParams.code_item),
    metal_title_code: encryptText(dataParams.metal_title_code)
  }, { new:true });
  if (!cart) return [404, `Item not found!`];
  
  let totalKadar = 0;
  let totalPrice = 0;

  let cart01 = await TmpPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer) }},
    { '$project': {
      "sub_total_kadar":"$sub_total_kadar",
      "sub_total_price":"$sub_total_price"
    } }
  ]);

  for (let c in cart01){
      totalKadar = Number(totalKadar) + Number(unMaskedNumber(cart01[c].sub_total_kadar));
      totalPrice = Number(totalPrice) + Number(unMaskedNumber(cart01[c].sub_total_price));
  }

  let tmpTotalPo =  await TmpPo.updateMany({
  kode_customer: encryptText(dataParams.kode_customer)},
  {
    total_kadar: maskedNumber(totalKadar),
    total_price: maskedNumber(totalPrice)
  },{session:session});

  return [200, "Item successfully deleted!"];
}

// Hapus Semua Di Troli
async function deleteCartAll(session, dataUser, dataParams) {
  let cart01 = await TmpPo.findOne({ kode_customer: encryptText(dataParams.kode_customer) });
  if (!cart01) return [400,`Customer not found!`];

  const cartDeleteAll = await TmpPo.deleteMany({
    kode_customer: encryptText(dataParams.kode_customer)
  }, { session: session });

  return [200, "Item successfully deleted!"];
}

// Lihat Data Di Troli
async function getCart(dataParams) {
  let cart = await TmpPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer) }},
    { '$project': fieldsTmpPo }
  ]);

  let resDec = decryptJSON(cart);
  return resDec;
}

// Total Item Di Troli
async function getCartCount(dataParams) {
  let cart = await TmpPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer) }},
    { $group: { _id: null, count: { $sum: 1 } } }
  ]);

  if (cart.length == 0){
    return [200, 0]
  }else{
    return [200, cart[0].count]
  }

}

// Simpan PO
async function addPo(session, dataUser, dataParams) {
  
  let arrDetailItem = [];
  let tmpKodeCustomer = "";
  let tmpNamaCustomer = "";
  let tmpTotalKadar = 0;
  let tmpTotalPrice = 0;

  let customer = await Customer.findOne({ kode_customer: encryptText(dataParams.kode_customer) });
  if (!customer) return [400,`Customer not found!`];

  let cart02 = await TmpPo.findOne({ kode_customer: encryptText(dataParams.kode_customer) });
  if (!cart02) return [400,`Item not found!`];

  const dDate = new Date();
  const resGenNoPo = await genNoPoNew(dDate);
  if  (resGenNoPo[0] !== 200) return resGenNoPo;
  const nomorPo = resGenNoPo[1];

  let cart01 = await TmpPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer) }},
    { '$project': fieldsTmpPo }
  ]);
  
  tmpKodeCustomer = cart01[0].kode_customer;
  tmpNamaCustomer = cart01[0].nama_customer;
  tmpTotalKadar = cart01[0].total_kadar;
  tmpTotalPrice = cart01[0].total_price;

  for (let c in cart01){
    arrDetailItem.push({
      code_item: cart01[c].code_item,
      item_name: cart01[c].item_name,
      lokasi_gambar: cart01[c].lokasi_gambar,
      metal_title_code: cart01[c].metal_title_code,
      type_kadar: cart01[c].type_kadar,
      kadar: cart01[c].kadar,
      price: cart01[c].price,
      total_nett_weight: cart01[c].total_nett_weight,
      total_gross_weight: cart01[c].total_gross_weight,
      qty_po: cart01[c].qty_po,
      sub_total_kadar: cart01[c].sub_total_kadar,
      sub_total_price: cart01[c].sub_total_price,
      notes: cart01[c].notes,
      status: encryptText("OPEN")
    });
  }

  customerPo = new CustomerPo({
    "kode_customer": tmpKodeCustomer,
    "nama_customer": tmpNamaCustomer,
    "itemdetail": arrDetailItem,
    "total_kadar": tmpTotalKadar,
    "total_price": tmpTotalPrice,
    "status_po": encryptText("OPEN"),
    "tgl_po":convertDate(dDate),
    "no_po": encryptText(nomorPo),
    "input_by": dataUser.user_id,
    "input_date":dateNow()
  });

  await customerPo.save({ session: session });
  
  const cartDelete = await TmpPo.deleteMany({
    kode_customer: encryptText(dataParams.kode_customer)
  }, { session: session });
  
  return [200, "Transaction successfully saved!"]; 
}

// Get PO Per Customer
async function getPo(dataParams) {
  let customerPo = await CustomerPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer) }},
    { '$project': fieldsCustomerPo }
  ]);

  let resDec = decryptJSON(customerPo);
  return resDec;
}

// Get Semua PO Status OPEN 
async function getPoAllOpen() {
  let customerPo = await CustomerPo.aggregate([
    { "$match": { "status_po": encryptText("OPEN") }},
    { '$project': fieldsCustomerPo }
  ]);

  let resDec = decryptJSON(customerPo);
  return resDec;
}

// Get Semua PO Tanpa Lihat Status 
async function getPoAllOpenClose() {
  let customerPo = await CustomerPo.aggregate([
    { '$project': fieldsCustomerPo }
  ]);

  let resDec = decryptJSON(customerPo);
  return resDec;
}

// Get Semua PO Status PROCESS
async function getPoAllClose() {
  let customerPo = await CustomerPo.aggregate([
    { "$match": { "status_po": encryptText("PROCESS") }},
    { '$project': fieldsCustomerPo }
  ]);

  let resDec = decryptJSON(customerPo);
  return resDec;
}

// Get Per PO Tanpa Lihat Status
async function getPoOne(dataParams) {
  let customerPo = await CustomerPo.aggregate([
    { "$match": { "kode_customer": encryptText(dataParams.kode_customer),"no_po": encryptText(dataParams.no_po) }},
    { '$project': fieldsCustomerPo }
  ]);

  let resDec = decryptJSON(customerPo);
  return resDec;
}

// Get Semua PO Per Customer Tanpa Lihat Status + Limit
async function getPoAllLimit(dataParams,dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  if (Number(dataParams.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
  if (Number(dataParams.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

  pipeLineAggregate.push({ 
    "$match": { 
      "kode_customer": encryptText(dataBody.kode_customer),
      "tgl_po": new Date(dataBody.tgl)
    }
  });
  pipeLineAggregate.push({ "$sort": { tgl_po: -1 } });
  
  stsPage = true;

  pipeLineAggregate.push(
    { "$lookup": { from: 'tt_po_customer', localField: 'no_po', foreignField: 'no_po', as: 'customer'}},
    { "$unwind": "$customer"}
  );

  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  pipeLineAggregate.push(
    { "$skip": Number(dataParams.limit_from) },
    { "$limit": Number(dataParams.limit_item) }
  );

  pipeLineAggregate.push({ "$project": fieldsCustomerPo })
  
  customerPo = await CustomerPo.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(customerPo[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (customerPo[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], customerPo[0].count_detail[0].count_item]
  }

}

// Get Semua PO Per Customer Tanpa Lihat Status Tanpa Limit
async function getPoAll(dataParams,dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  pipeLineAggregate.push({ 
    "$match": { 
      "kode_customer": encryptText(dataBody.kode_customer),
      "tgl_po": new Date(dataBody.tgl)
    }
  });
  pipeLineAggregate.push({ "$sort": { tgl_po: -1 } });
  
  stsPage = true;

  pipeLineAggregate.push(
    { "$lookup": { from: 'tt_po_customer', localField: 'no_po', foreignField: 'no_po', as: 'customer'}},
    { "$unwind": "$customer"}
  );

  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  // pipeLineAggregate.push(
  //   { "$skip": Number(dataParams.limit_from) },
  //   { "$limit": Number(dataParams.limit_item) }
  // );

  pipeLineAggregate.push({ "$project": fieldsCustomerPo })
  
  customerPo = await CustomerPo.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(customerPo[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (customerPo[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], customerPo[0].count_detail[0].count_item]
  }

}

// Get Semua PO Status PROCESS/CLOSE
async function getPoAllCloseByTgl(dataParams,dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  if (Number(dataParams.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
  if (Number(dataParams.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

  pipeLineAggregate.push({ 
    "$match": { 
      "status_po": encryptText("PROCESS"),
      "tgl_po": {
        $gte: new Date(dataBody.tgl1),
        $lte: new Date(dataBody.tgl2)
      }
    }
  });
  pipeLineAggregate.push({ "$sort": { tgl_po: -1 } });
  
  stsPage = true;

  pipeLineAggregate.push(
    { "$lookup": { from: 'tt_po_customer', localField: 'no_po', foreignField: 'no_po', as: 'customer'}},
    { "$unwind": "$customer"}
  );

  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  pipeLineAggregate.push(
    { "$skip": Number(dataParams.limit_from) },
    { "$limit": Number(dataParams.limit_item) }
  );

  pipeLineAggregate.push({ "$project": fieldsCustomerPo })
  
  customerPo = await CustomerPo.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(customerPo[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (customerPo[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], customerPo[0].count_detail[0].count_item]
  }
  
}

// Close PO
async function closePo(session, dataUser, dataParams,dataBody) {
  
  let closePo01 = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po),
    status_po : encryptText("OPEN")
  });
  if (!closePo01) return [400,`PO not found!`];

  for (let c in dataBody){
    let statusItem = await CustomerPo.findOne({
      no_po: encryptText(dataParams.no_po),
      "itemdetail.code_item": encryptText(dataBody[c].code_item)
    });
    if (!statusItem) return [404, `Item not found!`];

    statusItem.itemdetail[c].status = encryptText(dataBody[c].status);
    await statusItem.save({ session: session });
  }

  let closePo = await CustomerPo.findOneAndUpdate({
    no_po: encryptText(dataParams.no_po)
  },{
    status_po : encryptText("PROCESS")
  },{ session: session });

  return [200, "Transaction successfully saved!"];
}

// Delete Semua Item Di PO (OPEN)
async function deletePoAllOpen(session, dataUser, dataParams) {
  tmpNoPO = "";
  tmpKdCust = "";
  tmpNamaCust = "";
  tmpEmail = "";

  let resDelete01 = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po),
    status_po: encryptText("OPEN")
  });
  if (!resDelete01) return [400, `PO not found`];

  tmpKdCust = resDelete01.kode_customer;
  let resCust = await Customer.findOne({
    kode_customer: tmpKdCust
  });
  if (!resCust) return [400, `PO not found`];

  tmpEmail = decryptText(resCust.user[0].email);
  tmpNoPO = decryptText(resDelete01.no_po);
  tmpNamaCust = decryptText(resDelete01.nama_customer);

  const resDelete = await CustomerPo.findOneAndRemove({
    no_po: encryptText(dataParams.no_po),
    status_po: encryptText("OPEN")
  }, { session: session });
  if (!resDelete) return [400, `PO not found`];

  sendEmailPO({
    nama_lkp: tmpNamaCust,
    email: tmpEmail,
    no_po: tmpNoPO
  }).catch(error => {
    console.log(error);
  });

  return [200, "PO successfully deleted!"];
}

// Delete Per Item Di PO (OPEN)
async function deletePoOpen(session, dataUser, dataParams) {
  let totalKadar = 0;
  let totalPrice = 0;
  let totalItem = 0;

  let resDel01 = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po),
    status_po: encryptText("OPEN")
  });
  if (!resDel01) return [400, `PO not found`];
  
  let resItem = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po),
    "itemdetail.code_item": encryptText(dataParams.code_item),
    "itemdetail.status": encryptText("OPEN"),
    "itemdetail.metal_title_code": encryptText(dataParams.metal_title_code)
  });
  if (!resItem) return [400, `PO not found`];

  // Cek Hanya Satu Barang
  const resDelAll = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po)
  });

  totalItem = Object.keys(resDelAll.itemdetail).length;

  if (totalItem == 1){
    const delAll = await CustomerPo.findOneAndRemove({
      no_po: encryptText(dataParams.no_po),
      status_po: encryptText("OPEN")
    }, { session: session });

    return [200, "PO successfully deleted!"];
  }else{
    
  }
  // Cek Hanya Satu Barang

  const resDel02 = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po),
    "itemdetail.code_item": encryptText(dataParams.code_item),
    "itemdetail.status": encryptText("OPEN"),
    "itemdetail.metal_title_code": encryptText(dataParams.metal_title_code)
  });
  if (!resDel02) return [400, `PO not found`];
  
  const objIndex = resDel02.itemdetail.findIndex(obj => obj.code_item == encryptText(dataParams.code_item) && obj.metal_title_code == encryptText(dataParams.metal_title_code))

  resDel02.itemdetail.splice(objIndex, 1);
  await resDel02.save({ new : true });

  let resDel03 = await CustomerPo.aggregate([
    { "$match": { "no_po": encryptText(dataParams.no_po) }},
    { '$project': {
      "itemdetail":"$itemdetail"
    } }
  ]);

  for (let c in resDel03[0].itemdetail){
      totalKadar = Number(totalKadar) + Number(unMaskedNumber(resDel03[0].itemdetail[c].sub_total_kadar));
      totalPrice = Number(totalPrice) + Number(unMaskedNumber(resDel03[0].itemdetail[c].sub_total_price));
  }

  let tmpTotalPo =  await CustomerPo.findOneAndUpdate({
    no_po: encryptText(dataParams.no_po)},
  {
    total_kadar: maskedNumber(totalKadar),
    total_price: maskedNumber(totalPrice)
  },{session:session});

  return [200, "PO successfully deleted!"];
}

// Delete Semua Item Di PO (PROCESS)
async function deletePoAllClose(session, dataUser, dataParams) {
  
  let resDelete01 = await CustomerPo.findOne({
    no_po: encryptText(dataParams.no_po),
    status: encryptText("PROCESS")
  });
  if (!resDelete01) return [400, `PO not found`];

  const resDelete = await CustomerPo.findOneAndRemove({
    no_po: encryptText(dataParams.no_po),
    status: encryptText("PROCESS")
  }, { session: session });

  return [200, "PO successfully deleted!"];
}

exports.addToCart = addToCart;
exports.deleteCart = deleteCart;
exports.deleteCartAll = deleteCartAll;
exports.editCart = editCart;
exports.getCart = getCart;
exports.getCartCount = getCartCount;
exports.addPo = addPo;
exports.getPo = getPo;
exports.getPoOne = getPoOne;
exports.getPoAll = getPoAll;
exports.getPoAllLimit = getPoAllLimit;
exports.getPoAllOpen = getPoAllOpen;
exports.getPoAllClose = getPoAllClose;
exports.getPoAllCloseByTgl = getPoAllCloseByTgl;
exports.getPoAllOpenClose = getPoAllOpenClose;
exports.closePo = closePo;
exports.deletePoAllOpen = deletePoAllOpen;
exports.deletePoOpen = deletePoOpen;
exports.deletePoAllClose = deletePoAllClose;
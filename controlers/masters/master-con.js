const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { encryptJSON, encryptText, decryptText, decryptJSON } = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');

const { 
  MaterialType,
  validateMaterialTypeAdd, 
  fieldsMaterialType
} = require('../../models/masters/material-type-mdl');

const { 
  Customer,
  validateCustomerAdd,
  fieldsCustomer
} = require('../../models/masters/customer-mdl');

const { Kota } = require('../../models/masters/region/kota-mdl');
const { Area } = require('../../models/masters/region/area-mdl');

async function addCustomer(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let customer = await Customer.findOne({ kode_customer: dataBody.kode_customer });
  if (customer) return [400,`Customer sudah terdaftar!`];

  let userId = await Customer.findOne({ user_id: dataBody.user_id });
  if (userId) return [400,`User id sudah terdaftar!`];

  customer = new Customer({
    "kode_customer": "cust001",
    "nama_customer": dataBody.nama_customer,
    "nama_owner": dataBody.nama_owner,
    "negara": dataBody.negara,
    "provinsi": dataBody.provinsi,
    "kota": dataBody.kota,
    "area": dataBody.area,
    "alamat": dataBody.alamat,
    "user_id": dataBody.user_id,
    "nama_user": dataBody.nama_user,
    "email": dataBody.email,
    "password": dataBody.password,
    "kontak": dataBody.kontak,
    "level": dataBody.level

    
  });

  await customer.save({ session: session });

  return [200, "Data Customer berhasil di simpan!"];
}

async function addMaster(session, dataUser, dataBody,datakategori,datauniq,datauniq2) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let master = await datakategori.findOne({kode_customer:dataBody.kode_customer });

  if (datakategori) return [400, datakategori `sudah terdaftar!`];

  // datakategori = new datakategori({
  //   material_type_code: dataBody.material_type_code,
  //   material_type_name: dataBody.material_type_name,
  //   item_code: dataBody.item_code
  // });

  // 

  

  // await Baki.insertMany(arrBaki, { session: session });

  // return [200, "success."];
  // 

  await datakategori.save({ session: session });

  // return [200, "Data kategori type berhasil di simpan!"];
}

exports.addCustomer = addCustomer;
exports.addMaster = addMaster;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON
} = require('../../../middleware/encrypt');
const { dateNow, convertDate } = require('../../../middleware/convertdate');

const { 
  Provinsi,
  validateProvinsiAdd, 
  fieldsProvinsi
} = require('../../../models/masters/region/provinsi-mdl');

async function addProvinsi(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let provinsi = await Provinsi.findOne({ id_negara: encBody.id_negara,nama_provinsi:encBody.nama_provinsi });
  if (provinsi) return [400,`Provinsi sudah terdaftar!`];

  provinsi = new Provinsi({
    "id_negara": encBody.id_negara,
    "nama_provinsi": encBody.nama_provinsi
  });
  
  await provinsi.save({ session: session });
  
  return [200, "Data Provinsi berhasil di simpan!"];
}

async function editProvinsi(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let prov = await Provinsi.findOneAndUpdate({ _id: dataParams.id_provinsi },
    {
      nama_provinsi: encBody.nama_provinsi
  },{ session: session });
  if (!prov) return [404, `Data Provinsi tidak di temukan!`];

  return [200, "Edit data Provinsi berhasil!"];
}

async function deleteProvinsi(session, dataUser, dataParams) {
  const prov = await Provinsi.findOneAndRemove({
    _id: dataParams.id_provinsi
  }, { session: session });
  if (!prov) return [404, `Data Provinsi tidak di temukan!`];
  
  return [200, "Delete data provinsi berhasil!"];
}

async function getProvinsi() {
  let prov = await Provinsi.aggregate([
    { '$project': fieldsProvinsi }
  ]);

  let resDec = decryptJSON(prov);
  return resDec;
}

exports.addProvinsi = addProvinsi;
exports.editProvinsi = editProvinsi;
exports.deleteProvinsi = deleteProvinsi;
exports.getProvinsi = getProvinsi;
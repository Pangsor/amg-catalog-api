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
  Kota,
  fieldsNegara,
  fieldsKota
} = require('../../../models/masters/region/kota-mdl');

async function addKota(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let kota = await Kota.findOne({ id_provinsi:encBody.id_provinsi,nama_kota: encBody.nama_kota });
  if (kota) return [400,`Kota sudah terdaftar!`];

  kota = new Kota({
    "id_provinsi": encBody.id_provinsi,
    "nama_kota": encBody.nama_kota
  });
  
  await kota.save({ session: session });
  
  return [200, "Data Kota berhasil di simpan!"];
}

async function editKota(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let kota = await Kota.findOneAndUpdate({ _id: dataParams.id_kota },
    {
      nama_kota: encBody.nama_kota
  },{ session: session });
  if (!kota) return [404, `Data Kota tidak di temukan!`];

  return [200, "Edit data Kota berhasil!"];
}

async function deleteKota(session, dataUser, dataParams) {
  const kota = await Kota.findOneAndRemove({
    _id: dataParams.id_kota
  }, { session: session });
  if (!kota) return [404, `Data Kota tidak di temukan!`];
  
  return [200, "Delete data kota berhasil!"];
}

async function getKota() {
  let kota = await Kota.aggregate([
    { '$project': fieldsKota }
  ]);

  let resDec = decryptJSON(kota);
  return resDec;
}

exports.addKota = addKota;
exports.editKota = editKota;
exports.deleteKota = deleteKota;
exports.getKota = getKota;
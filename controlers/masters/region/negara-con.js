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
  Negara,
  validateNegaraAdd,
  fieldsNegara
} = require('../../../models/masters/region/negara-mdl');

async function addNegara(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let negara = await Negara.findOne({ nama_negara: encBody.nama_negara });
  if (negara) return [400,`Negara sudah terdaftar!`];

  negara = new Negara({
    "nama_negara": encBody.nama_negara
  });
  
  await negara.save({ session: session });
  
  return [200, "Data Negara berhasil di simpan!"];
}

async function editNegara(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let negara = await Negara.findOneAndUpdate({ _id: dataParams.id_negara },
    {
      nama_negara: encBody.nama_negara
  },{ session: session });
  if (!negara) return [404, `Data Negara tidak di temukan!`];

  return [200, "Edit data Negara berhasil!"];
}

async function deleteNegara(session, dataUser, dataParams) {
  const negara = await Negara.findOneAndRemove({
    _id: dataParams.id_negara
  }, { session: session });
  if (!negara) return [404, `Data Negara tidak di temukan!`];
  
  return [200, "Delete data negara berhasil!"];
}

async function getNegara() {
  let negara = await Negara.aggregate([
    { '$project': fieldsNegara }
  ]);

  let resDec = decryptJSON(negara);
  return resDec;
}

exports.addNegara = addNegara;
exports.editNegara = editNegara;
exports.deleteNegara = deleteNegara;
exports.getNegara = getNegara;
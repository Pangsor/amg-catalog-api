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
  Area,
  fieldsArea
} = require('../../../models/masters/region/area-mdl');

async function addArea(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let area = await Area.findOne({ id_kota:encBody.id_kota,nama_area: encBody.nama_area });
  if (area) return [400,`Area sudah terdaftar!`];

  area = new Area({
    "id_kota": encBody.id_kota,
    "nama_area": encBody.nama_area
  });
  
  await area.save({ session: session });
  
  return [200, "Data Area berhasil di simpan!"];
}

async function editArea(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let area = await Area.findOneAndUpdate({ _id: dataParams.id_area },
    {
      nama_area: encBody.nama_area
  },{ session: session });
  if (!area) return [404, `Data Area tidak di temukan!`];

  return [200, "Edit data Area berhasil!"];
}

async function deleteArea(session, dataUser, dataParams) {
  const area = await Area.findOneAndRemove({
    _id: dataParams.id_area
  }, { session: session });
  if (!area) return [404, `Data Area tidak di temukan!`];
  
  return [200, "Delete data Area berhasil!"];
}

async function getArea() {
  let area = await Area.aggregate([
    { '$project': fieldsArea }
  ]);

  let resDec = decryptJSON(area);
  return resDec;
}

exports.addArea = addArea;
exports.editArea = editArea;
exports.deleteArea = deleteArea;
exports.getArea = getArea;
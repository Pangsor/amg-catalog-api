const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON
} = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');

const { 
  FinishType, 
  fieldsFinishType
} = require('../../models/masters/finish-type-mdl');


async function addFinishType(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let finishType = await FinishType.findOne({ finish_type_code:encBody.finish_type_code });
  if (finishType) return [400,`Finish Type sudah terdaftar!`];

  finishType = new FinishType({
    "finish_type_code": encBody.finish_type_code,
    "finish_type_name": encBody.finish_type_name,
    "item_code": encBody.item_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await finishType.save({ session: session });
  
  return [200, "Data Finish Type berhasil di simpan!"]; 
}

async function editFinishType(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let finishType = await FinishType.findOneAndUpdate({ finish_type_code: encryptText(dataParams.finish_type_code) },
    {
      finish_type_name: encBody.finish_type_name,
      item_code: encBody.item_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!finishType) return [404, `Data Finish Type tidak di temukan!`];

  return [200, "Edit data Finish Type berhasil!"];
}

async function deleteFinishType(session, dataUser, dataParams) {
  const finishType = await FinishType.findOneAndRemove({
    finish_type_code: encryptText(dataParams.finish_type_code)
  }, { session: session });
  if (!finishType) return [404, `Data Finish Type tidak di temukan!`];
  
  return [200, "Delete data Finish Type berhasil!"];
}

async function getFinishType() {
  let finishType = await FinishType.aggregate([
    { '$project': fieldsFinishType }
  ]);

  let resDec = decryptJSON(finishType);
  return resDec;
}

exports.addFinishType = addFinishType;
exports.editFinishType = editFinishType;
exports.deleteFinishType = deleteFinishType;
exports.getFinishType = getFinishType;
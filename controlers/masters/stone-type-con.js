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
  StoneType, 
  fieldsStoneType
} = require('../../models/masters/stone-type-mdl');

async function addStoneType(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneType = await StoneType.findOne({ stone_type_code:encBody.stone_type_code });
  if (stoneType) return [400,`Stone Type sudah terdaftar!`];

  stoneType = new StoneType({
    "stone_type_code": encBody.stone_type_code,
    "stone_type_name": encBody.stone_type_name,
    "stone_code": encBody.stone_code
  });
  
  await stoneType.save({ session: session });
  
  return [200, "Data Stone Type berhasil di simpan!"]; 
}

async function editStoneType(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneType = await StoneType.findOneAndUpdate({ stone_type_code: encryptText(dataParams.stone_type_code) },
    {
      stone_type_name: encBody.stone_type_name,
      stone_code: encBody.stone_code
  },{ session: session });
  if (!stoneType) return [404, `Data Stone Type tidak di temukan!`];

  return [200, "Edit data Stone Type berhasil!"];
}

async function deleteStoneType(session, dataUser, dataParams) {
  const stoneType = await StoneType.findOneAndRemove({
    stone_type_code: encryptText(dataParams.stone_type_code)
  }, { session: session });
  if (!stoneType) return [404, `Data Stone Type tidak di temukan!`];
  
  return [200, "Delete data Stone Type berhasil!"];
}

async function getStoneType() {
  let stoneType = await StoneType.aggregate([
    { '$project': fieldsStoneType }
  ]);

  let resDec = decryptJSON(stoneType);
  return resDec;
}

exports.addStoneType = addStoneType;
exports.editStoneType = editStoneType;
exports.deleteStoneType = deleteStoneType;
exports.getStoneType = getStoneType;
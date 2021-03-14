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
  StoneOrigin, 
  fieldsStoneOrigin
} = require('../../models/masters/stone-origin-mdl');

async function addStoneOrigin(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneOrigin = await StoneOrigin.findOne({ stone_origin_code:encBody.stone_origin_code });
  if (stoneOrigin) return [400,`Stone Origin sudah terdaftar!`];

  stoneOrigin = new StoneOrigin({
    "stone_origin_code": encBody.stone_origin_code,
    "stone_origin_name": encBody.stone_origin_name,
    "stone_code": encBody.stone_code,
  });

  await stoneOrigin.save({ session: session });
  
  return [200, "Data Stone Origin berhasil di simpan!"]; 
}

async function editStoneOrigin(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneOrigin = await StoneOrigin.findOneAndUpdate({ stone_origin_code: encryptText(dataParams.stone_origin_code) },
    {
      stone_origin_name: encBody.stone_origin_name,
      stone_code: encBody.stone_code
  },{ session: session });
  if (!stoneOrigin) return [404, `Data Stone Origin tidak di temukan!`];

  return [200, "Edit data Stone Origin berhasil!"];
}

async function deleteStoneOrigin(session, dataUser, dataParams) {
  const stoneOrigin = await StoneOrigin.findOneAndRemove({
    stone_origin_code: encryptText(dataParams.stone_origin_code)
  }, { session: session });
  if (!stoneOrigin) return [404, `Data Stone Origin tidak di temukan!`];
  
  return [200, "Delete data Stone Origin berhasil!"];
}

async function getStoneOrigin() {
  let stoneOrigin = await StoneOrigin.aggregate([
    { '$project': fieldsStoneOrigin }
  ]);

  let resDec = decryptJSON(stoneOrigin);
  return resDec;
}

exports.addStoneOrigin = addStoneOrigin;
exports.editStoneOrigin = editStoneOrigin;
exports.deleteStoneOrigin = deleteStoneOrigin;
exports.getStoneOrigin = getStoneOrigin;
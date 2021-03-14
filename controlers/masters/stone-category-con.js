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
  StoneCategory, 
  fieldsStoneCategory
} = require('../../models/masters/stone-category-mdl');

async function addStoneCategory(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneCategory = await StoneCategory.findOne({ stone_category_code:encBody.stone_category_code });
  if (stoneCategory) return [400,`Stone Category sudah terdaftar!`];

  stoneCategory = new StoneCategory({
    "stone_category_code": encBody.stone_category_code,
    "stone_category_name": encBody.stone_category_name,
    "stone_code": encBody.stone_code
  });
  
  await stoneCategory.save({ session: session });
  
  return [200, "Data Stone Category berhasil di simpan!"]; 
}

async function editStoneCategory(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneCategory = await StoneCategory.findOneAndUpdate({ stone_category_code: encryptText(dataParams.stone_category_code) },
    {
      stone_category_name: encBody.stone_category_name,
      stone_code: encBody.stone_code
  },{ session: session });
  if (!stoneCategory) return [404, `Data Stone Category tidak di temukan!`];

  return [200, "Edit data Stone Category berhasil!"];
}

async function deleteStoneCategory(session, dataUser, dataParams) {
  const stoneCategory = await StoneCategory.findOneAndRemove({
    stone_category_code: encryptText(dataParams.stone_category_code)
  }, { session: session });
  if (!stoneCategory) return [404, `Data Stone Category tidak di temukan!`];
  
  return [200, "Delete data Stone Category Type berhasil!"];
}

async function getStoneCategory() {
  let stoneCategory = await StoneCategory.aggregate([
    { '$project': fieldsStoneCategory }
  ]);

  let resDec = decryptJSON(stoneCategory);
  return resDec;
}

exports.addStoneCategory = addStoneCategory;
exports.editStoneCategory = editStoneCategory;
exports.deleteStoneCategory = deleteStoneCategory;
exports.getStoneCategory = getStoneCategory;
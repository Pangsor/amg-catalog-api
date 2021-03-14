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
  StoneGrade, 
  fieldsStoneGrade
} = require('../../models/masters/stone-grade-mdl');

async function addStoneGrade(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneGrade = await StoneGrade.findOne({ stone_grade_code:encBody.stone_grade_code });
  if (stoneGrade) return [400,`Stone Grade sudah terdaftar!`];

  stoneGrade = new StoneGrade({
    "stone_grade_code": encBody.stone_grade_code,
    "stone_grade_name": encBody.stone_grade_name,
    "stone_code": encBody.stone_code,
  });

  await stoneGrade.save({ session: session });
  
  return [200, "Data Stone Grade berhasil di simpan!"]; 
}

async function editStoneGrade(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneGrade = await StoneGrade.findOneAndUpdate({ stone_grade_code: encryptText(dataParams.stone_grade_code) },
    {
      stone_grade_name: encBody.stone_grade_name,
      stone_code: encBody.stone_code
  },{ session: session });
  if (!stoneGrade) return [404, `Data Stone Grade tidak di temukan!`];

  return [200, "Edit data Stone Grade berhasil!"];
}

async function deleteStoneGrade(session, dataUser, dataParams) {
  const stoneGrade = await StoneGrade.findOneAndRemove({
    stone_grade_code: encryptText(dataParams.stone_grade_code)
  }, { session: session });
  if (!stoneGrade) return [404, `Data Stone Grade tidak di temukan!`];
  
  return [200, "Delete data Stone Grade berhasil!"];
}

async function getStoneGrade() {
  let stoneGrade = await StoneGrade.aggregate([
    { '$project': fieldsStoneGrade }
  ]);

  let resDec = decryptJSON(stoneGrade);
  return resDec;
}

exports.addStoneGrade = addStoneGrade;
exports.editStoneGrade = editStoneGrade;
exports.deleteStoneGrade = deleteStoneGrade;
exports.getStoneGrade = getStoneGrade;
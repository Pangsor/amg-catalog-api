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
  StoneShape, 
  fieldsStoneShape
} = require('../../models/masters/stone-shape-mdl');

async function addStoneShape(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneShape = await StoneShape.findOne({ stone_shape_code:encBody.stone_shape_code });
  if (stoneShape) return [400,`Stone Shape sudah terdaftar!`];

  stoneShape = new StoneShape({
    "stone_shape_code": encBody.stone_shape_code,
    "stone_shape_name": encBody.stone_shape_name
  });

  await stoneShape.save({ session: session });
  
  return [200, "Data Stone Shape berhasil di simpan!"]; 
}

async function editStoneShape(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneShape = await StoneShape.findOneAndUpdate({ stone_shape_code: encryptText(dataParams.stone_shape_code) },
    {
      stone_shape_name: encBody.stone_shape_name
  },{ session: session });
  if (!stoneShape) return [404, `Data Stone Shape tidak di temukan!`];

  return [200, "Edit data Stone Shape berhasil!"];
}

async function deleteStoneShape(session, dataUser, dataParams) {
  const stoneShape = await StoneShape.findOneAndRemove({
    stone_shape_code: encryptText(dataParams.stone_shape_code)
  }, { session: session });
  if (!stoneShape) return [404, `Data Stone Shape tidak di temukan!`];
  
  return [200, "Delete data Stone Shape berhasil!"];
}

async function getStoneShape() {
  let stoneShape = await StoneShape.aggregate([
    { '$project': fieldsStoneShape }
  ]);

  let resDec = decryptJSON(stoneShape);
  return resDec;
}

exports.addStoneShape = addStoneShape;
exports.editStoneShape = editStoneShape;
exports.deleteStoneShape = deleteStoneShape;
exports.getStoneShape = getStoneShape;
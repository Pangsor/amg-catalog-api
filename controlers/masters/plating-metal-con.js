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
  PlatingMetal, 
  fieldsPlatingMetal
} = require('../../models/masters/plating-metal-mdl');

async function addPlatingMetal(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let platingMetal = await PlatingMetal.findOne({ plating_metal_code:encBody.plating_metal_code });
  if (platingMetal) return [400,`Plating Metal sudah terdaftar!`];

  platingMetal = new PlatingMetal({
    "plating_metal_code": encBody.plating_metal_code,
    "plating_metal_name": encBody.plating_metal_name,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });

  await platingMetal.save({ session: session });
  
  return [200, "Data Plating Metal berhasil di simpan!"]; 
}

async function editPlatingMetal(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let platingMetal = await PlatingMetal.findOneAndUpdate({ plating_metal_code: encryptText(dataParams.plating_metal_code) },
    {
      plating_metal_name: encBody.plating_metal_name,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!platingMetal) return [404, `Data Plating Metal tidak di temukan!`];

  return [200, "Edit data Plating Metal berhasil!"];
}

async function deletePlatingMetal(session, dataUser, dataParams) {
  const platingMetal = await PlatingMetal.findOneAndRemove({
    plating_metal_code: encryptText(dataParams.plating_metal_code)
  }, { session: session });
  if (!platingMetal) return [404, `Data Plating Metal tidak di temukan!`];
  
  return [200, "Delete data Plating Metal berhasil!"];
}

async function getPlatingMetal() {
  let platingMetal = await PlatingMetal.aggregate([
    { '$project': fieldsPlatingMetal }
  ]);

  let resDec = decryptJSON(platingMetal);
  return resDec;
}

exports.addPlatingMetal = addPlatingMetal;
exports.editPlatingMetal= editPlatingMetal;
exports.deletePlatingMetal = deletePlatingMetal;
exports.getPlatingMetal = getPlatingMetal;
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
  PlatingMethod, 
  fieldsPlatingMethod
} = require('../../models/masters/plating-method-mdl');

async function addPlatingMethod(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let platingMethod = await PlatingMethod.findOne({ plating_method_code:encBody.plating_method_code });
  if (platingMethod) return [400,`Plating Method sudah terdaftar!`];

  platingMethod = new PlatingMethod({
    "plating_method_code": encBody.plating_method_code,
    "plating_method_name": encBody.plating_method_name,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });

  await platingMethod.save({ session: session });
  
  return [200, "Data Plating Method berhasil di simpan!"]; 
}

async function editPlatingMethod(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let platingMethod = await PlatingMethod.findOneAndUpdate({ plating_method_code: encryptText(dataParams.plating_method_code) },
    {
      plating_method_name: encBody.plating_method_name,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!platingMethod) return [404, `Data Plating Method tidak di temukan!`];

  return [200, "Edit data Plating Method berhasil!"];
}

async function deletePlatingMethod(session, dataUser, dataParams) {
  const platingMethod = await PlatingMethod.findOneAndRemove({
    plating_method_code: encryptText(dataParams.plating_method_code)
  }, { session: session });
  if (!platingMethod) return [404, `Data Plating Method tidak di temukan!`];
  
  return [200, "Delete data Plating Method berhasil!"];
}

async function getPlatingMethod() {
  let platingMethod = await PlatingMethod.aggregate([
    { '$project': fieldsPlatingMethod }
  ]);

  let resDec = decryptJSON(platingMethod);
  return resDec;
}

exports.addPlatingMethod = addPlatingMethod;
exports.editPlatingMethod= editPlatingMethod;
exports.deletePlatingMethod = deletePlatingMethod;
exports.getPlatingMethod = getPlatingMethod;
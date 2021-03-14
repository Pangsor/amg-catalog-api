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
  MaterialMetalTitle, 
  fieldsMaterialMetalTitle
} = require('../../models/masters/material-metal-title-mdl');

async function addMaterialMetalTitle(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let materialMetalTitle = await MaterialMetalTitle.findOne({ metal_title_code:encBody.metal_title_code });
  if (materialMetalTitle) return [400,`Material Metal Title sudah terdaftar!`];

  materialMetalTitle = new MaterialMetalTitle({
    "metal_title_code": encBody.metal_title_code,
    "metal_title_name": encBody.metal_title_name,
    "quote_data_price_code": encBody.quote_data_price_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });

  await materialMetalTitle.save({ session: session });
  
  return [200, "Data Material Metal Title berhasil di simpan!"]; 
}

async function editMaterialMetalTitle(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let materialMetalTitle = await MaterialMetalTitle.findOneAndUpdate({ metal_title_code: encryptText(dataParams.metal_title_code) },
    {
      metal_title_name: encBody.metal_title_name,
      quote_data_price_code: encBody.quote_data_price_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!materialMetalTitle) return [404, `Data Material Metal Title tidak di temukan!`];

  return [200, "Edit data Material Metal Title berhasil!"];
}

async function deleteMaterialMetalTitle(session, dataUser, dataParams) {
  const materialMetalTitle = await MaterialMetalTitle.findOneAndRemove({
    metal_title_code: encryptText(dataParams.metal_title_code)
  }, { session: session });
  if (!materialMetalTitle) return [404, `Data Material Metal Title tidak di temukan!`];
  
  return [200, "Delete data Material Metal Title berhasil!"];
}

async function getMaterialMetalTitle() {
  let materialMetalTitle = await MaterialMetalTitle.aggregate([
    { '$project': fieldsMaterialMetalTitle }
  ]);

  let resDec = decryptJSON(materialMetalTitle);
  return resDec;
}

exports.addMaterialMetalTitle = addMaterialMetalTitle;
exports.editMaterialMetalTitle = editMaterialMetalTitle;
exports.deleteMaterialMetalTitle = deleteMaterialMetalTitle;
exports.getMaterialMetalTitle = getMaterialMetalTitle;
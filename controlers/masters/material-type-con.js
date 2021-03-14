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
  MaterialType, 
  fieldsMaterialType
} = require('../../models/masters/material-type-mdl');


async function addMaterialType(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let materialType = await MaterialType.findOne({ material_type_code:encBody.material_type_code });
  if (materialType) return [400,`Material Type sudah terdaftar!`];

  materialType = new MaterialType({
    "material_type_code": encBody.material_type_code,
    "material_type_name": encBody.material_type_name,
    "item_code": encBody.item_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await materialType.save({ session: session });
  
  return [200, "Data Material Type berhasil di simpan!"]; 
}

async function editMaterialType(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let materialType = await MaterialType.findOneAndUpdate({ material_type_code: encryptText(dataParams.material_type_code) },
    {
      material_type_name: encBody.material_type_name,
      item_code: encBody.item_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!materialType) return [404, `Data Material Type tidak di temukan!`];

  return [200, "Edit data Material Type berhasil!"];
}

async function deleteMaterialType(session, dataUser, dataParams) {
  const materialType = await MaterialType.findOneAndRemove({
    material_type_code: encryptText(dataParams.material_type_code)
  }, { session: session });
  if (!materialType) return [404, `Data Material Type tidak di temukan!`];
  
  return [200, "Delete data Material Type berhasil!"];
}

async function getMaterialType() {
  let materialType = await MaterialType.aggregate([
    { '$project': fieldsMaterialType }
  ]);

  let resDec = decryptJSON(materialType);
  return resDec;
}

exports.addMaterialType = addMaterialType;
exports.editMaterialType = editMaterialType;
exports.deleteMaterialType = deleteMaterialType;
exports.getMaterialType = getMaterialType;
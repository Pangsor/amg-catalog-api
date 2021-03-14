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
  MetalColour, 
  fieldsMetalColour
} = require('../../models/masters/metal-colour-mdl');

async function addMetalColour(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let metalColour = await MetalColour.findOne({ colour_type_code:encBody.colour_type_code });
  if (metalColour) return [400,`Material Metal Title sudah terdaftar!`];

  metalColour = new MetalColour({
    "colour_type_code": encBody.colour_type_code,
    "colour_type_name": encBody.colour_type_name,
    "item_code": encBody.item_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await metalColour.save({ session: session });
  
  return [200, "Data Metal Colour berhasil di simpan!"]; 
}

async function editMetalColour(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let metalColour = await MetalColour.findOneAndUpdate({ colour_type_code: encryptText(dataParams.colour_type_code) },
    {
      colour_type_name: encBody.colour_type_name,
      item_code: encBody.item_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!metalColour) return [404, `Data Metal Colour tidak di temukan!`];

  return [200, "Edit data Metal Colour berhasil!"];
}

async function deleteMetalColour(session, dataUser, dataParams) {
  const metalColour = await MetalColour.findOneAndRemove({
    colour_type_code: encryptText(dataParams.colour_type_code)
  }, { session: session });
  if (!metalColour) return [404, `Data Metal Colour tidak di temukan!`];
  
  return [200, "Delete data Metal Colour berhasil!"];
}

async function getMetalColour() {
  let metalColour = await MetalColour.aggregate([
    { '$project': fieldsMetalColour }
  ]);

  let resDec = decryptJSON(metalColour);
  return resDec;
}

exports.addMetalColour = addMetalColour;
exports.editMetalColour = editMetalColour;
exports.deleteMetalColour = deleteMetalColour;
exports.getMetalColour = getMetalColour;
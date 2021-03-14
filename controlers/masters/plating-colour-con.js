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
  PlatingColour, 
  fieldsPlatingColour
} = require('../../models/masters/plating-colour-mdl');

async function addPlatingColour(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let platingColour = await PlatingColour.findOne({ plating_colour_code:encBody.plating_colour_code });
  if (platingColour) return [400,`Plating Colour sudah terdaftar!`];

  platingColour = new PlatingColour({
    "plating_colour_code": encBody.plating_colour_code,
    "plating_colour_name": encBody.plating_colour_name,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });

  await platingColour.save({ session: session });
  
  return [200, "Data Plating Colour berhasil di simpan!"]; 
}

async function editPlatingColour(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let platingColour = await PlatingColour.findOneAndUpdate({ plating_colour_code: encryptText(dataParams.plating_colour_code) },
    {
      plating_colour_name: encBody.plating_colour_name,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!platingColour) return [404, `Data Plating Colour tidak di temukan!`];

  return [200, "Edit data Plating Colour berhasil!"];
}

async function deletePlatingColour(session, dataUser, dataParams) {
  const platingColour = await PlatingColour.findOneAndRemove({
    plating_colour_code: encryptText(dataParams.plating_colour_code)
  }, { session: session });
  if (!platingColour) return [404, `Data Plating Colour tidak di temukan!`];
  
  return [200, "Delete data Plating Colour berhasil!"];
}

async function getPlatingColour() {
  let platingColour = await PlatingColour.aggregate([
    { '$project': fieldsPlatingColour }
  ]);

  let resDec = decryptJSON(platingColour);
  return resDec;
}

exports.addPlatingColour = addPlatingColour;
exports.editPlatingColour= editPlatingColour;
exports.deletePlatingColour = deletePlatingColour;
exports.getPlatingColour = getPlatingColour;
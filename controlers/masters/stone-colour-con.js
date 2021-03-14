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
  StoneColour, 
  fieldsStoneColour
} = require('../../models/masters/stone-colour-mdl');

async function addStoneColour(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneColour = await StoneColour.findOne({ stone_colour_code:encBody.stone_colour_code });
  if (stoneColour) return [400,`Stone Colour sudah terdaftar!`];

  stoneColour = new StoneColour({
    "stone_colour_code": encBody.stone_colour_code,
    "stone_colour_name": encBody.stone_colour_name,
    "stone_code": encBody.stone_code
  });
  
  await stoneColour.save({ session: session });
  
  return [200, "Data Stone Colour berhasil di simpan!"]; 
}

async function editStoneColour(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneColour = await StoneColour.findOneAndUpdate({ stone_colour_code: encryptText(dataParams.stone_colour_code) },
    {
      stone_colour_name: encBody.stone_colour_name,
      stone_code: encBody.stone_code
  },{ session: session });
  if (!stoneColour) return [404, `Data Stone Colour tidak di temukan!`];

  return [200, "Edit data Stone Colour berhasil!"];
}

async function deleteStoneColour(session, dataUser, dataParams) {
  const stoneColour = await StoneColour.findOneAndRemove({
    stone_colour_code: encryptText(dataParams.stone_colour_code)
  }, { session: session });
  if (!stoneColour) return [404, `Data Stone Colour tidak di temukan!`];
  
  return [200, "Delete data Stone Colour berhasil!"];
}

async function getStoneColour() {
  let stoneColour = await StoneColour.aggregate([
    { '$project': fieldsStoneColour }
  ]);

  let resDec = decryptJSON(stoneColour);
  return resDec;
}

exports.addStoneColour = addStoneColour;
exports.editStoneColour = editStoneColour;
exports.deleteStoneColour = deleteStoneColour;
exports.getStoneColour = getStoneColour;
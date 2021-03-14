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
  NickelContent, 
  fieldsNickelContent
} = require('../../models/masters/nickel-content-mdl');


async function addNickelContent(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let nickelContent = await NickelContent.findOne({ nickel_content_code:encBody.nickel_content_code });
  if (nickelContent) return [400,`Nickel Content sudah terdaftar!`];

  nickelContent = new NickelContent({
    "nickel_content_code": encBody.nickel_content_code,
    "nickel_content_name": encBody.nickel_content_name,
    "colour_type_code": encBody.colour_type_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await nickelContent.save({ session: session });
  
  return [200, "Data Nickel Content berhasil di simpan!"]; 
}

async function editNickelContent(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let nickelContent = await NickelContent.findOneAndUpdate({ nickel_content_code: encryptText(dataParams.nickel_content_code) },
    {
      nickel_content_name: encBody.nickel_content_name,
      colour_type_code: encBody.colour_type_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!nickelContent) return [404, `Data Nickel Content tidak di temukan!`];

  return [200, "Edit data Nickel Content berhasil!"];
}

async function deleteNickelContent(session, dataUser, dataParams) {
  const nickelContent = await NickelContent.findOneAndRemove({
    nickel_content_code: encryptText(dataParams.nickel_content_code)
  }, { session: session });
  if (!nickelContent) return [404, `Data Nickel Content tidak di temukan!`];
  
  return [200, "Delete data Nickel Content berhasil!"];
}

async function getNickelContent() {
  let nickelContent = await NickelContent.aggregate([
    { '$project': fieldsNickelContent }
  ]);

  let resDec = decryptJSON(nickelContent);
  return resDec;
}

exports.addNickelContent = addNickelContent;
exports.editNickelContent = editNickelContent;
exports.deleteNickelContent = deleteNickelContent;
exports.getNickelContent = getNickelContent;
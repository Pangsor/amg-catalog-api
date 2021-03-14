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
  Finding, 
  fieldsFinding
} = require('../../models/masters/finding-mdl');

async function addFinding(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let finding = await Finding.findOne({ specify_finding_code:encBody.specify_finding_code });
  if (finding) return [400,`Finding sudah terdaftar!`];

  finding = new Finding({
    "specify_finding_code": encBody.specify_finding_code,
    "specify_finding_name": encBody.specify_finding_name,
    "item_code": encBody.item_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await finding.save({ session: session });
  
  return [200, "Data Finding berhasil di simpan!"]; 
}

async function editFinding(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let finding = await Finding.findOneAndUpdate({ specify_finding_code: encryptText(dataParams.specify_finding_code) },
    {
      specify_finding_name: encBody.specify_finding_name,
      item_code: encBody.item_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!finding) return [404, `Data Finding tidak di temukan!`];

  return [200, "Edit data Finding berhasil!"];
}

async function deleteFinding(session, dataUser, dataParams) {
  const finding = await Finding.findOneAndRemove({
    specify_finding_code: encryptText(dataParams.specify_finding_code)
  }, { session: session });
  if (!finding) return [404, `Data Finding tidak di temukan!`];
  
  return [200, "Delete data Finding Type berhasil!"];
}

async function getFinding() {
  let finding = await Finding.aggregate([
    { '$project': fieldsFinding }
  ]);

  let resDec = decryptJSON(finding);
  return resDec;
}

exports.addFinding = addFinding;
exports.editFinding = editFinding;
exports.deleteFinding = deleteFinding;
exports.getFinding = getFinding;
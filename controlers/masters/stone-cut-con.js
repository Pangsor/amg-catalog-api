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
  StoneCut, 
  fieldsStoneCut
} = require('../../models/masters/stone-cut-mdl');

async function addStoneCut(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneCut = await StoneCut.findOne({ cut_stone_code:encBody.cut_stone_code });
  if (stoneCut) return [400,`Stone Cut sudah terdaftar!`];

  stoneCut = new StoneCut({
    "cut_stone_code": encBody.cut_stone_code,
    "cut_stone_name": encBody.cut_stone_name,
    "stone_code": encBody.stone_code
  });
  
  console.log(stoneCut);
  await stoneCut.save({ session: session });
  
  return [200, "Data Stone Cut berhasil di simpan!"]; 
}

async function editStoneCut(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let stoneCut = await StoneCut.findOneAndUpdate({ cut_stone_code: encryptText(dataParams.cut_stone_code) },
    {
      cut_stone_name: encBody.cut_stone_name,
      stone_code: encBody.stone_code
  },{ session: session });
  if (!stoneCut) return [404, `Data Stone Cut tidak di temukan!`];

  return [200, "Edit data Stone Cut berhasil!"];
}

async function deleteStoneCut(session, dataUser, dataParams) {
  const stoneCut = await StoneCut.findOneAndRemove({
    cut_stone_code: encryptText(dataParams.cut_stone_code)
  }, { session: session });
  if (!stoneCut) return [404, `Data Stone Cut tidak di temukan!`];
  
  return [200, "Delete data Stone Cut berhasil!"];
}

async function getStoneCut() {
  let stoneCut = await StoneCut.aggregate([
    { '$project': fieldsStoneCut }
  ]);

  let resDec = decryptJSON(stoneCut);
  return resDec;
}

exports.addStoneCut = addStoneCut;
exports.editStoneCut = editStoneCut;
exports.deleteStoneCut = deleteStoneCut;
exports.getStoneCut = getStoneCut;
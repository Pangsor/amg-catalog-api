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
  ChainType, 
  fieldsChainType
} = require('../../models/masters/chain-type-mdl');

async function addChainType(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let chainType = await ChainType.findOne({ chain_type_code:encBody.chain_type_code });
  if (chainType) return [400,`Chain Type sudah terdaftar!`];

  chainType = new ChainType({
    "chain_type_code": encBody.chain_type_code,
    "chain_type_name": encBody.chain_type_name,
    "item_chains_code": encBody.item_chains_code,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await chainType.save({ session: session });
  
  return [200, "Data Chain Type berhasil di simpan!"]; 
}

async function editChainType(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let chainType = await ChainType.findOneAndUpdate({ chain_type_code: encryptText(dataParams.chain_type_code) },
    {
      chain_type_name: encBody.chain_type_name,
      item_chains_code: encBody.item_chains_code,
      edit_by: dataUser.user_id,
      edit_date: dateNow()
  },{ session: session });
  if (!chainType) return [404, `Data Chain Type tidak di temukan!`];

  return [200, "Edit data Chain Type berhasil!"];
}

async function deleteChainType(session, dataUser, dataParams) {
  const chainType = await ChainType.findOneAndRemove({
    chain_type_code: encryptText(dataParams.chain_type_code)
  }, { session: session });
  if (!chainType) return [404, `Data Chain Type tidak di temukan!`];
  
  return [200, "Delete data Chain Type berhasil!"];
}

async function getChainType() {
  let chainType = await ChainType.aggregate([
    { '$project': fieldsChainType }
  ]);

  let resDec = decryptJSON(chainType);
  return resDec;
}

exports.addChainType = addChainType;
exports.editChainType = editChainType;
exports.deleteChainType = deleteChainType;
exports.getChainType = getChainType;
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
  SampleQuantityType, 
  fieldsSampleQuantityType
} = require('../../models/masters/sample-quantity-type-mdl');


async function addSampleQtyType(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleQtyType = await SampleQuantityType.findOne({ qty_code:encBody.qty_code });
  if (sampleQtyType) return [400,`Sample Quantity Type sudah terdaftar!`];

  sampleQtyType = new SampleQuantityType({
    "qty_code": encBody.qty_code,
    "qty_name": encBody.qty_name
  });
  
  await sampleQtyType.save({ session: session });
  
  return [200, "Data Sample Quantity Type berhasil di simpan!"]; 
}

async function editSampleQtyType(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleQtyType = await SampleQuantityType.findOneAndUpdate({ qty_code: encryptText(dataParams.qty_code) },
    {
      qty_name: encBody.qty_name
  },{ session: session });
  if (!sampleQtyType) return [404, `Data Sample Quantity Type tidak di temukan!`];

  return [200, "Edit data Sample Quantity Type berhasil!"];
}

async function deleteSampleQtyType(session, dataUser, dataParams) {
  const sampleQtyType = await SampleQuantityType.findOneAndRemove({
    qty_code: encryptText(dataParams.qty_code)
  }, { session: session });
  if (!sampleQtyType) return [404, `Data Sample Quantity Type tidak di temukan!`];
  
  return [200, "Delete data Sample Quantity Type berhasil!"];
}

async function getSampleQtyType() {
  let sampleQtyType = await SampleQuantityType.aggregate([
    { '$project': fieldsSampleQuantityType }
  ]);

  let resDec = decryptJSON(sampleQtyType);
  return resDec;
}

exports.addSampleQtyType = addSampleQtyType;
exports.editSampleQtyType = editSampleQtyType;
exports.deleteSampleQtyType = deleteSampleQtyType;
exports.getSampleQtyType = getSampleQtyType;
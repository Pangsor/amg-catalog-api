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
  SampleType, 
  fieldsSampleType
} = require('../../models/masters/sample-type-mdl');


async function addSampleType(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleType = await SampleType.findOne({ sample_type_code:encBody.sample_type_code });
  if (sampleType) return [400,`Sample Type sudah terdaftar!`];

  sampleType = new SampleType({
    "sample_type_code": encBody.sample_type_code,
    "sample_type_name": encBody.sample_type_name,
    "item_code": encBody.item_code
  });
  
  await sampleType.save({ session: session });
  
  return [200, "Data Sample Type berhasil di simpan!"]; 
}

async function editSampleType(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleType = await SampleType.findOneAndUpdate({ sample_type_code: encryptText(dataParams.sample_type_code) },
    {
      sample_type_name: encBody.sample_type_name,
      item_code: encBody.item_code
  },{ session: session });
  if (!sampleType) return [404, `Data Sample Type tidak di temukan!`];

  return [200, "Edit data Sample Type berhasil!"];
}

async function deleteSampleType(session, dataUser, dataParams) {
  const sampleType = await SampleType.findOneAndRemove({
    sample_type_code: encryptText(dataParams.sample_type_code)
  }, { session: session });
  if (!sampleType) return [404, `Data Sample Type tidak di temukan!`];
  
  return [200, "Delete data Sample Type berhasil!"];
}

async function getSampleType() {
  let sampleType = await SampleType.aggregate([
    { '$project': fieldsSampleType }
  ]);

  let resDec = decryptJSON(sampleType);
  return resDec;
}

exports.addSampleType = addSampleType;
exports.editSampleType = editSampleType;
exports.deleteSampleType = deleteSampleType;
exports.getSampleType = getSampleType;
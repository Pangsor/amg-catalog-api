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
  SampleCategory, 
  fieldsSampleCategory
} = require('../../models/masters/sample-category-mdl');


async function addSampleCategory(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleCategory = await SampleCategory.findOne({ category_code:encBody.category_code });
  if (sampleCategory) return [400,`Sample Category sudah terdaftar!`];

  sampleCategory = new SampleCategory({
    "category_code": encBody.category_code,
    "category_name": encBody.category_name
  });
  
  await sampleCategory.save({ session: session });
  
  return [200, "Data Sample Category berhasil di simpan!"]; 
}

async function editSampleCategory(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleCategory = await SampleCategory.findOneAndUpdate({ category_code: encryptText(dataParams.category_code) },
    {
      category_name: encBody.category_name
  },{ session: session });
  if (!sampleCategory) return [404, `Data Sample Category tidak di temukan!`];

  return [200, "Edit data Sample Category berhasil!"];
}

async function deleteSampleCategory(session, dataUser, dataParams) {
  const sampleCategory = await SampleCategory.findOneAndRemove({
    category_code: encryptText(dataParams.category_code)
  }, { session: session });
  if (!sampleCategory) return [404, `Data Sample Category tidak di temukan!`];
  
  return [200, "Delete data Sample Category berhasil!"];
}

async function getSampleCategory() {
  let sampleCategory = await SampleCategory.aggregate([
    { '$project': fieldsSampleCategory }
  ]);

  let resDec = decryptJSON(sampleCategory);
  return resDec;
}

exports.addSampleCategory = addSampleCategory;
exports.editSampleCategory = editSampleCategory;
exports.deleteSampleCategory = deleteSampleCategory;
exports.getSampleCategory = getSampleCategory;
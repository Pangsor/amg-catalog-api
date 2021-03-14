const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  SampleCategory,
  validateSampleCategoryAdd,
  validateSampleCategoryEdit
} = require('../../models/masters/sample-category-mdl');

const sampleCategoryCon = require('../../controlers/masters/sample-category-con');

// Simpan
router.post('/sample-category', Auth, async(req, res) => {
  const { error } = validateSampleCategoryAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await SampleCategory.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resSampleCategory = await sampleCategoryCon.addSampleCategory(session, req.user, dataJson[1]);
  if (resSampleCategory[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resSampleCategory[0]).send(resSampleCategory[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resSampleCategory[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetSampleCategory = await sampleCategoryCon.getSampleCategory();
  if (resGetSampleCategory[0] !== 200) return res.status(resGetSampleCategory[0]).send({
    "status": "error",
    "pesan": resGetSampleCategory[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetSampleCategory[1]
  });
});

// Edit
router.put('/1/:category_code', Auth, async(req, res) => {
  const { error } = validateSampleCategoryEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdtSmplCat = await sampleCategoryCon.editSampleCategory(session, req.user, req.params, dataJson[1]);
  if ( resUpdtSmplCat[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdtSmplCat[0]).send({
      "status": "error",
      "pesan": resUpdtSmplCat[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdtSmplCat[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:category_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelSampleCategory = await sampleCategoryCon.deleteSampleCategory(session, req.user, req.params );
  if( resDelSampleCategory[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelSampleCategory[0]).send({
      "status": "error",
      "pesan": resDelSampleCategory[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelSampleCategory[1],
    "data": [{}]
  });
});

module.exports = router;
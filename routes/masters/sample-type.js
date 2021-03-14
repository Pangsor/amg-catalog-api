const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  SampleType,
  validateSampleTypeAdd,
  validateSampleTypeEdit
} = require('../../models/masters/sample-type-mdl');

const sampleTypeCon = require('../../controlers/masters/sample-type-con');

// Simpan
router.post('/sample-type', Auth, async(req, res) => {
  const { error } = validateSampleTypeAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await SampleType.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resSampleType = await sampleTypeCon.addSampleType(session, req.user, dataJson[1]);
  if (resSampleType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resSampleType[0]).send(resSampleType[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resSampleType[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetSampleType = await sampleTypeCon.getSampleType();
  if (resGetSampleType[0] !== 200) return res.status(resGetSampleType[0]).send({
    "status": "error",
    "pesan": resGetSampleType[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetSampleType[1]
  });
});

// Edit
router.put('/1/:sample_type_code', Auth, async(req, res) => {
  const { error } = validateSampleTypeEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateSampleType = await sampleTypeCon.editSampleType(session, req.user, req.params, dataJson[1]);
  if ( resUpdateSampleType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateSampleType[0]).send({
      "status": "error",
      "pesan": resUpdateSampleType[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateSampleType[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:sample_type_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelSampleType = await sampleTypeCon.deleteSampleType(session, req.user, req.params );
  if( resDelSampleType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelSampleType[0]).send({
      "status": "error",
      "pesan": resDelSampleType[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelSampleType[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  SampleQuantityType,
  validateSampleQuantityTypeAdd,
  validateSampleQuantityTypeEdit
} = require('../../models/masters/sample-quantity-type-mdl');

const sampleQtyTypeCon = require('../../controlers/masters/sample-quantity-type-con');

// Simpan
router.post('/sample-quantity-type', Auth, async(req, res) => {
  const { error } = validateSampleQuantityTypeAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await SampleQuantityType.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resSampleQtyType = await sampleQtyTypeCon.addSampleQtyType(session, req.user, dataJson[1]);
  if (resSampleQtyType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resSampleQtyType[0]).send(resSampleQtyType[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resSampleQtyType[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetSampleQtyType = await sampleQtyTypeCon.getSampleQtyType();
  if (resGetSampleQtyType[0] !== 200) return res.status(resGetSampleQtyType[0]).send({
    "status": "error",
    "pesan": resGetSampleQtyType[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetSampleQtyType[1]
  });
});

// Edit
router.put('/1/:qty_code', Auth, async(req, res) => {
  const { error } = validateSampleQuantityTypeEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdtSmplQtyType = await sampleQtyTypeCon.editSampleQtyType(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdtSmplQtyType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdtSmplQtyType[0]).send({
      "status": "error",
      "pesan": resUpdtSmplQtyType[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdtSmplQtyType[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:qty_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelSampleQtyType = await sampleQtyTypeCon.deleteSampleQtyType(session, req.user, dataParams[1] );
  if( resDelSampleQtyType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelSampleQtyType[0]).send({
      "status": "error",
      "pesan": resDelSampleQtyType[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelSampleQtyType[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  Finding,
  validateFindingAdd,
  validateFindingEdit
} = require('../../models/masters/finding-mdl');

const findingCon = require('../../controlers/masters/finding-con');

// Simpan
router.post('/finding', Auth, async(req, res) => {
  const { error } = validateFindingAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await Finding.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resFinding = await findingCon.addFinding(session, req.user, dataJson[1]);
  if (resFinding[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resFinding[0]).send({
      "status":"error",
      "pesan":resFinding[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resFinding[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetFinding = await findingCon.getFinding();
  if (resGetFinding[0] !== 200) return res.status(resGetFinding[0]).send({
    "status": "error",
    "pesan": resGetFinding[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetFinding[1]
  });
});

// Edit
router.put('/1/:specify_finding_code', Auth, async(req, res) => {
  const { error } = validateFindingEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateFinding = await findingCon.editFinding(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateFinding[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateFinding[0]).send({
      "status": "error",
      "pesan": resUpdateFinding[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateFinding[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:specify_finding_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelFinding = await findingCon.deleteFinding(session, req.user, dataParams[1] );
  if( resDelFinding[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelFinding[0]).send({
      "status": "error",
      "pesan": resDelFinding[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelFinding[1],
    "data": [{}]
  });
});

module.exports = router;
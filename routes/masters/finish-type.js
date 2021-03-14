const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  FinishType,
  validateFinishTypeAdd,
  validateFinishTypeEdit
} = require('../../models/masters/finish-type-mdl');

const finishTypeCon = require('../../controlers/masters/finish-type-con');

// Simpan
router.post('/finish-type', Auth, async(req, res) => {
  const { error } = validateFinishTypeAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await FinishType.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resfinishType = await finishTypeCon.addFinishType(session, req.user, dataJson[1]);
  if (resfinishType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resfinishType[0]).send({
      "status":"error",
      "pesan":resfinishType[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resfinishType[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetFinishType = await finishTypeCon.getFinishType();
  if (resGetFinishType[0] !== 200) return res.status(resGetFinishType[0]).send({
    "status": "error",
    "pesan": resGetFinishType[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetFinishType[1]
  });
});

// Edit
router.put('/1/:finish_type_code', Auth, async(req, res) => {
  const { error } = validateFinishTypeEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdtFinishType = await finishTypeCon.editFinishType(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdtFinishType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdtFinishType[0]).send({
      "status": "error",
      "pesan": resUpdtFinishType[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdtFinishType[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:finish_type_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelFinishType = await finishTypeCon.deleteFinishType(session, req.user, dataParams[1] );
  if( resDelFinishType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelFinishType[0]).send({
      "status": "error",
      "pesan": resDelFinishType[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelFinishType[1],
    "data": [{}]
  });
});

module.exports = router;
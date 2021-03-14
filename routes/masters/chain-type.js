const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  ChainType,
  validateChainTypeAdd,
  validateChainTypeEdit
} = require('../../models/masters/chain-type-mdl');

const chainTypeCon = require('../../controlers/masters/chain-type-con');

// Simpan
router.post('/chain-type', Auth, async(req, res) => {
  const { error } = validateChainTypeAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await ChainType.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resChainType = await chainTypeCon.addChainType(session, req.user, dataJson[1]);
  if (resChainType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resChainType[0]).send({
      "status":"error",
      "pesan":resChainType[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resChainType[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetChainType = await chainTypeCon.getChainType();
  if (resGetChainType[0] !== 200) return res.status(resGetChainType[0]).send({
    "status": "error",
    "pesan": resGetChainType[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetChainType[1]
  });
});

// Edit
router.put('/1/:chain_type_code', Auth, async(req, res) => {
  const { error } = validateChainTypeEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdtChainType = await chainTypeCon.editChainType(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdtChainType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdtChainType[0]).send({
      "status": "error",
      "pesan": resUpdtChainType[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdtChainType[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:chain_type_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelChainType = await chainTypeCon.deleteChainType(session, req.user, dataParams[1] );
  if( resDelChainType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelChainType[0]).send({
      "status": "error",
      "pesan": resDelChainType[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelChainType[1],
    "data": [{}]
  });
});

module.exports = router;
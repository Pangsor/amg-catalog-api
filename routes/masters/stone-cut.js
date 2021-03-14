const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneCut,
  validateStoneCutAdd,
  validateStoneCutEdit
} = require('../../models/masters/stone-cut-mdl');

const stoneCutCon = require('../../controlers/masters/stone-cut-con');

// Simpan
router.post('/stone-cut', Auth, async(req, res) => {
  const { error } = validateStoneCutAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneCut.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneCut = await stoneCutCon.addStoneCut(session, req.user, dataJson[1]);
  if (resStoneCut[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneCut[0]).send(resStoneCut[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneCut[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneCut = await stoneCutCon.getStoneCut();
  if (resGetStoneCut[0] !== 200) return res.status(resGetStoneCut[0]).send({
    "status": "error",
    "pesan": resGetStoneCut[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneCut[1]
  });
});

// Edit
router.put('/1/:cut_stone_code', Auth, async(req, res) => {
  const { error } = validateStoneCutEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneCut = await stoneCutCon.editStoneCut(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneCut[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneCut[0]).send({
      "status": "error",
      "pesan": resUpdateStoneCut[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneCut[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:cut_stone_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneCut = await stoneCutCon.deleteStoneCut(session, req.user, dataParams[1] );
  if( resDelStoneCut[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneCut[0]).send({
      "status": "error",
      "pesan": resDelStoneCut[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneCut[1],
    "data": [{}]
  });
});

module.exports = router;
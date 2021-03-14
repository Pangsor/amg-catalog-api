const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneOrigin,
  validateStoneOriginAdd,
  validateStoneOriginEdit
} = require('../../models/masters/stone-origin-mdl');

const stoneOriginCon = require('../../controlers/masters/stone-origin-con');

// Simpan
router.post('/stone-origin', Auth, async(req, res) => {
  const { error } = validateStoneOriginAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneOrigin.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneOrigin = await stoneOriginCon.addStoneOrigin(session, req.user, dataJson[1]);
  if (resStoneOrigin[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneOrigin[0]).send(resStoneOrigin[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneOrigin[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneOrigin = await stoneOriginCon.getStoneOrigin();
  if (resGetStoneOrigin[0] !== 200) return res.status(resGetStoneOrigin[0]).send({
    "status": "error",
    "pesan": resGetStoneOrigin[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneOrigin[1]
  });
});

// Edit
router.put('/1/:stone_origin_code', Auth, async(req, res) => {
  const { error } = validateStoneOriginEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneOrigin = await stoneOriginCon.editStoneOrigin(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneOrigin[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneOrigin[0]).send({
      "status": "error",
      "pesan": resUpdateStoneOrigin[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneOrigin[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:stone_origin_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneOrigin = await stoneOriginCon.deleteStoneOrigin(session, req.user, dataParams[1] );
  if( resDelStoneOrigin[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneOrigin[0]).send({
      "status": "error",
      "pesan": resDelStoneOrigin[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneOrigin[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneType,
  validateStoneTypeAdd,
  validateStoneTypeEdit
} = require('../../models/masters/stone-type-mdl');

const stoneTypeCon = require('../../controlers/masters/stone-type-con');

// Simpan
router.post('/stone-type', Auth, async(req, res) => {
  const { error } = validateStoneTypeAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneType.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneType = await stoneTypeCon.addStoneType(session, req.user, dataJson[1]);
  if (resStoneType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneType[0]).send(resStoneType[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneType[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneType = await stoneTypeCon.getStoneType();
  if (resGetStoneType[0] !== 200) return res.status(resGetStoneType[0]).send({
    "status": "error",
    "pesan": resGetStoneType[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneType[1]
  });
});

// Edit
router.put('/1/:stone_type_code', Auth, async(req, res) => {
  const { error } = validateStoneTypeEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneType = await stoneTypeCon.editStoneType(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneType[0]).send({
      "status": "error",
      "pesan": resUpdateStoneType[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneType[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:stone_type_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneType = await stoneTypeCon.deleteStoneType(session, req.user, dataParams[1] );
  if( resDelStoneType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneType[0]).send({
      "status": "error",
      "pesan": resDelStoneType[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneType[1],
    "data": [{}]
  });
});

module.exports = router;
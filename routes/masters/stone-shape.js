const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneShape,
  validateStoneShapeAdd,
  validateStoneShapeEdit
} = require('../../models/masters/stone-shape-mdl');

const stoneShapeCon = require('../../controlers/masters/stone-shape-con');

// Simpan
router.post('/stone-shape', Auth, async(req, res) => {
  const { error } = validateStoneShapeAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneShape.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneShape = await stoneShapeCon.addStoneShape(session, req.user, dataJson[1]);
  if (resStoneShape[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneShape[0]).send(resStoneShape[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneShape[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneShape = await stoneShapeCon.getStoneShape();
  if (resGetStoneShape[0] !== 200) return res.status(resGetStoneShape[0]).send({
    "status": "error",
    "pesan": resGetStoneShape[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneShape[1]
  });
});

// Edit
router.put('/1/:stone_shape_code', Auth, async(req, res) => {
  const { error } = validateStoneShapeEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneShape = await stoneShapeCon.editStoneShape(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneShape[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneShape[0]).send({
      "status": "error",
      "pesan": resUpdateStoneShape[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneShape[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:stone_shape_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneShape = await stoneShapeCon.deleteStoneShape(session, req.user, dataParams[1] );
  if( resDelStoneShape[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneShape[0]).send({
      "status": "error",
      "pesan": resDelStoneShape[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneShape[1],
    "data": [{}]
  });
});

module.exports = router;
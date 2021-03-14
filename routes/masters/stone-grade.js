const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneGrade,
  validateStoneGradeAdd,
  validateStoneGradeEdit
} = require('../../models/masters/stone-grade-mdl');

const stoneGradeCon = require('../../controlers/masters/stone-grade-con');

// Simpan
router.post('/stone-grade', Auth, async(req, res) => {
  const { error } = validateStoneGradeAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneGrade.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneGrade = await stoneGradeCon.addStoneGrade(session, req.user, dataJson[1]);
  if (resStoneGrade[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneGrade[0]).send(resStoneGrade[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneGrade[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneGrade = await stoneGradeCon.getStoneGrade();
  if (resGetStoneGrade[0] !== 200) return res.status(resGetStoneGrade[0]).send({
    "status": "error",
    "pesan": resGetStoneGrade[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneGrade[1]
  });
});

// Edit
router.put('/1/:stone_grade_code', Auth, async(req, res) => {
  const { error } = validateStoneGradeEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneGrade = await stoneGradeCon.editStoneGrade(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneGrade[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneGrade[0]).send({
      "status": "error",
      "pesan": resUpdateStoneGrade[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneGrade[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:stone_grade_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneGrade = await stoneGradeCon.deleteStoneGrade(session, req.user, dataParams[1] );
  if( resDelStoneGrade[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneGrade[0]).send({
      "status": "error",
      "pesan": resDelStoneGrade[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneGrade[1],
    "data": [{}]
  });
});

module.exports = router;
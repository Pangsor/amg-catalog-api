const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneCategory,
  validateStoneCategoryAdd,
  validateStoneCategoryEdit
} = require('../../models/masters/stone-category-mdl');

const stoneCategoryCon = require('../../controlers/masters/stone-category-con');

// Simpan
router.post('/stone-category', Auth, async(req, res) => {
  const { error } = validateStoneCategoryAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneCategory.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneCategory = await stoneCategoryCon.addStoneCategory(session, req.user, dataJson[1]);
  if (resStoneCategory[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneCategory[0]).send(resStoneCategory[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneCategory[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneCategory = await stoneCategoryCon.getStoneCategory();
  if (resGetStoneCategory[0] !== 200) return res.status(resGetStoneCategory[0]).send({
    "status": "error",
    "pesan": resGetStoneCategory[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneCategory[1]
  });
});

// Edit
router.put('/1/:stone_category_code', Auth, async(req, res) => {
  const { error } = validateStoneCategoryEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneCategory = await stoneCategoryCon.editStoneCategory(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneCategory[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneCategory[0]).send({
      "status": "error",
      "pesan": resUpdateStoneCategory[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneCategory[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:stone_category_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneCategory = await stoneCategoryCon.deleteStoneCategory(session, req.user, dataParams[1] );
  if( resDelStoneCategory[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneCategory[0]).send({
      "status": "error",
      "pesan": resDelStoneCategory[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneCategory[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  StoneColour,
  validateStoneColourAdd,
  validateStoneColourEdit
} = require('../../models/masters/stone-colour-mdl');

const stoneColourCon = require('../../controlers/masters/stone-colour-con');

// Simpan
router.post('/stone-colour', Auth, async(req, res) => {
  const { error } = validateStoneColourAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await StoneColour.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resStoneColour = await stoneColourCon.addStoneColour(session, req.user, dataJson[1]);
  if (resStoneColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resStoneColour[0]).send(resStoneColour[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resStoneColour[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetStoneColour = await stoneColourCon.getStoneColour();
  if (resGetStoneColour[0] !== 200) return res.status(resGetStoneColour[0]).send({
    "status": "error",
    "pesan": resGetStoneColour[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetStoneColour[1]
  });
});

// Edit
router.put('/1/:stone_colour_code', Auth, async(req, res) => {
  const { error } = validateStoneColourEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateStoneColour = await stoneColourCon.editStoneColour(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateStoneColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateStoneColour[0]).send({
      "status": "error",
      "pesan": resUpdateStoneColour[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateStoneColour[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:stone_colour_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelStoneColour = await stoneColourCon.deleteStoneColour(session, req.user, dataParams[1] );
  if( resDelStoneColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelStoneColour[0]).send({
      "status": "error",
      "pesan": resDelStoneColour[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelStoneColour[1],
    "data": [{}]
  });
});

module.exports = router;
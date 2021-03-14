const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  PlatingColour,
  validatePlatingColourAdd,
  validatePlatingColourEdit
} = require('../../models/masters/plating-colour-mdl');

const platingColourCon = require('../../controlers/masters/plating-colour-con');

// Simpan
router.post('/plating-colour', Auth, async(req, res) => {
  const { error } = validatePlatingColourAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await PlatingColour.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resPlatingColour = await platingColourCon.addPlatingColour(session, req.user, dataJson[1]);
  if (resPlatingColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resPlatingColour[0]).send({
      "status":"error",
      "pesan":resPlatingColour[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resPlatingColour[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetPlatingColour = await platingColourCon.getPlatingColour();
  if (resGetPlatingColour[0] !== 200) return res.status(resGetPlatingColour[0]).send({
    "status": "error",
    "pesan": resGetPlatingColour[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPlatingColour[1]
  });
});

// Edit
router.put('/1/:plating_colour_code', Auth, async(req, res) => {
  const { error } = validatePlatingColourEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdatePlatingColour = await platingColourCon.editPlatingColour(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdatePlatingColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdatePlatingColour[0]).send({
      "status": "error",
      "pesan": resUpdatePlatingColour[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdatePlatingColour[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:plating_colour_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelPlatingColour = await platingColourCon.deletePlatingColour(session, req.user, dataParams[1] );
  if( resDelPlatingColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelPlatingColour[0]).send({
      "status": "error",
      "pesan": resDelPlatingColour[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelPlatingColour[1],
    "data": [{}]
  });
});

module.exports = router;
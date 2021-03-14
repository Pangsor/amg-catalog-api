const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  MetalColour,
  validateMetalColourAdd,
  validateMetalColourEdit
} = require('../../models/masters/metal-colour-mdl');

const metalColourCon = require('../../controlers/masters/metal-colour-con');

// Simpan
router.post('/metal-colour', Auth, async(req, res) => {
  const { error } = validateMetalColourAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await MetalColour.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resMetalColour = await metalColourCon.addMetalColour(session, req.user, dataJson[1]);
  if (resMetalColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resMetalColour[0]).send({
      "status":"error",
      "pesan":resMetalColour[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resMetalColour[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resMetalColour = await metalColourCon.getMetalColour();
  if (resMetalColour[0] !== 200) return res.status(resMetalColour[0]).send({
    "status": "error",
    "pesan": resMetalColour[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resMetalColour[1]
  });
});

// Edit
router.put('/1/:colour_type_code', Auth, async(req, res) => {
  const { error } = validateMetalColourEdit(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateMetalColour = await metalColourCon.editMetalColour(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateMetalColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateMetalColour[0]).send({
      "status": "error",
      "pesan": resUpdateMetalColour[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateMetalColour[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:colour_type_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelMetalColour = await metalColourCon.deleteMetalColour(session, req.user, dataParams[1] );
  if( resDelMetalColour[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelMetalColour[0]).send({
      "status": "error",
      "pesan": resDelMetalColour[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelMetalColour[1],
    "data": [{}]
  });
});

module.exports = router;
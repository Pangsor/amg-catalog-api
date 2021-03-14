const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  PlatingMetal,
  validatePlatingMetalAdd,
  validatePlatingMetalEdit
} = require('../../models/masters/plating-metal-mdl');

const platingMetalCon = require('../../controlers/masters/plating-metal-con');

// Simpan
router.post('/plating-metal', Auth, async(req, res) => {
  const { error } = validatePlatingMetalAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await PlatingMetal.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resPlatingMetal = await platingMetalCon.addPlatingMetal(session, req.user, dataJson[1]);
  if (resPlatingMetal[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resPlatingMetal[0]).send({
      "status":"error",
      "pesan":resPlatingMetal[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resPlatingMetal[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetPlatingMetal = await platingMetalCon.getPlatingMetal();
  if (resGetPlatingMetal[0] !== 200) return res.status(resGetPlatingMetal[0]).send({
    "status": "error",
    "pesan": resGetPlatingMetal[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPlatingMetal[1]
  });
});

// Edit
router.put('/1/:plating_metal_code', Auth, async(req, res) => {
  const { error } = validatePlatingMetalEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdatePlatingMetal = await platingMetalCon.editPlatingMetal(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdatePlatingMetal[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdatePlatingMetal[0]).send({
      "status": "error",
      "pesan": resUpdatePlatingMetal[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdatePlatingMetal[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:plating_metal_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelPlatingMetal = await platingMetalCon.deletePlatingMetal(session, req.user, dataParams[1] );
  if( resDelPlatingMetal[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelPlatingMetal[0]).send({
      "status": "error",
      "pesan": resDelPlatingMetal[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelPlatingMetal[1],
    "data": [{}]
  });
});

module.exports = router;
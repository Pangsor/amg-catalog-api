const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  PlatingMethod,
  validatePlatingMethodAdd,
  validatePlatingMethodEdit
} = require('../../models/masters/plating-method-mdl');

const platingMethodCon = require('../../controlers/masters/plating-method-con');

// Simpan
router.post('/plating-method', Auth, async(req, res) => {
  const { error } = validatePlatingMethodAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await PlatingMethod.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resPlatingMethod = await platingMethodCon.addPlatingMethod(session, req.user, dataJson[1]);
  if (resPlatingMethod[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resPlatingMethod[0]).send({
      "status":"error",
      "pesan":resPlatingMethod[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resPlatingMethod[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetPlatingMethod = await platingMethodCon.getPlatingMethod();
  if (resGetPlatingMethod[0] !== 200) return res.status(resGetPlatingMethod[0]).send({
    "status": "error",
    "pesan": resGetPlatingMethod[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPlatingMethod[1]
  });
});

// Edit
router.put('/1/:plating_method_code', Auth, async(req, res) => {
  const { error } = validatePlatingMethodEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdatePlatingMethod = await platingMethodCon.editPlatingMethod(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdatePlatingMethod[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdatePlatingMethod[0]).send({
      "status": "error",
      "pesan": resUpdatePlatingMethod[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdatePlatingMethod[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:plating_method_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelPlatingMethod = await platingMethodCon.deletePlatingMethod(session, req.user, dataParams[1] );
  if( resDelPlatingMethod[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelPlatingMethod[0]).send({
      "status": "error",
      "pesan": resDelPlatingMethod[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelPlatingMethod[1],
    "data": [{}]
  });
});

module.exports = router;
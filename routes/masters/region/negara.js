const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../../middleware/auth');
const { trimUcaseJSON } = require('../../../middleware/function');

const { 
  Negara,
  validateNegaraAdd,
  validateNegaraEdit
} = require('../../../models/masters/region/negara-mdl');

const negaraCon = require('../../../controlers/masters/region/negara-con');

// Simpan
router.post('/negara', async(req, res) => {
  const { error } = validateNegaraAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await Negara.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resNegara = await negaraCon.addNegara(session, req.user, dataJson[1]);
  
  if (resNegara[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resNegara[0]).send(resNegara[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resNegara[1]);
});

// Tampil Semua
router.get('/', async(req, res) => {
  const resGetNegara = await negaraCon.getNegara();
  if (resGetNegara[0] !== 200) return res.status(resGetNegara[0]).send({
    "status": "error",
    "pesan": resGetNegara[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetNegara[1]
  });
});

// Edit
router.put('/1/:id_negara', async(req, res) => {
  const { error } = validateNegaraEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateNegara = await negaraCon.editNegara(session, req.user, req.params, dataJson[1]);
  if ( resUpdateNegara[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateNegara[0]).send({
      "status": "error",
      "pesan": resUpdateNegara[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateNegara[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:id_negara', async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelNegara = await negaraCon.deleteNegara(session, req.user, req.params );
  if( resDelNegara[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelNegara[0]).send({
      "status": "error",
      "pesan": resDelNegara[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelNegara[1],
    "data": [{}]
  });
});

module.exports = router;
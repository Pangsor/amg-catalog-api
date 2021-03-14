const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../../middleware/auth');
const { trimUcaseJSON } = require('../../../middleware/function');

const { 
  Kota,
  validateKotaAdd,
  validateKotaEdit
} = require('../../../models/masters/region/kota-mdl');

const kotaCon = require('../../../controlers/masters/region/kota-con');

// Simpan
router.post('/kota', async(req, res) => {
  const { error } = validateKotaAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await Kota.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resKota = await kotaCon.addKota(session, req.user, dataJson[1]);
  
  if (resKota[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resKota[0]).send(resKota[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resKota[1]);
});

// Tampil Semua
router.get('/', async(req, res) => {
  const resGetKota = await kotaCon.getKota();
  if (resGetKota[0] !== 200) return res.status(resGetKota[0]).send({
    "status": "error",
    "pesan": resGetKota[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetKota[1]
  });
});

// Edit
router.put('/1/:id_kota', async(req, res) => {
  const { error } = validateKotaEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateKota = await kotaCon.editKota(session, req.user, req.params, dataJson[1]);
  if ( resUpdateKota[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateKota[0]).send({
      "status": "error",
      "pesan": resUpdateKota[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateKota[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:id_kota', async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelKota = await kotaCon.deleteKota(session, req.user, req.params );
  if( resDelKota[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelKota[0]).send({
      "status": "error",
      "pesan": resDelKota[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelKota[1],
    "data": [{}]
  });
});

module.exports = router;
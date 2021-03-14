const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../../middleware/auth');
const { trimUcaseJSON } = require('../../../middleware/function');

const { 
  Provinsi,
  validateProvinsiAdd,
  validateProvinsiEdit
} = require('../../../models/masters/region/provinsi-mdl');

const provinsiCon = require('../../../controlers/masters/region/provinsi-con');

// Simpan
router.post('/provinsi', Auth, async(req, res) => {
  const { error } = validateProvinsiAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await Provinsi.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resProvinsi = await provinsiCon.addProvinsi(session, req.user, dataJson[1]);
  
  if (resProvinsi[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resProvinsi[0]).send(resProvinsi[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resProvinsi[1]);
});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetProv = await provinsiCon.getProvinsi();
  if (resGetProv[0] !== 200) return res.status(resGetProv[0]).send({
    "status": "error",
    "pesan": resGetProv[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetProv[1]
  });
});

// Edit
router.put('/1/:id_provinsi', Auth, async(req, res) => {
  const { error } = validateProvinsiEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateProv = await provinsiCon.editProvinsi(session, req.user, req.params, dataJson[1]);
  if ( resUpdateProv[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateProv[0]).send({
      "status": "error",
      "pesan": resUpdateProv[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateProv[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:id_provinsi', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelProv = await provinsiCon.deleteProvinsi(session, req.user, req.params );
  if( resDelProv[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelProv[0]).send({
      "status": "error",
      "pesan": resDelProv[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelProv[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { nsiAuth,Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const systemCon = require('../../controlers/params/system-con');
const {
  SystemPerusahaan,
   validateSystemAdd
} = require('../../models/params/system-mdl');

// Create system user must nsiAuth
router.post('/', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resCreate = await systemCon.createSystemPerusahaan(session, req.user, req.body);
  if (resCreate[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resCreate[0]).send({
      "status": "error",
      "pesan": resCreate[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": [resCreate[1]]
  });
});

// Get System Perusahaan
router.get('/', async(req, res) => {
  const resGetSystem = await systemCon.getSystemPerusahaan();

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetSystem[1]
  })
});

module.exports = router;
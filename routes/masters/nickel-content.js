const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  NickelContent,
  validateNickelContentAdd,
  validateNickelContentEdit
} = require('../../models/masters/nickel-content-mdl');

const nickelContentCon = require('../../controlers/masters/nickel-content-con');

// Simpan
router.post('/nickel-content', Auth, async(req, res) => {
  const { error } = validateNickelContentAdd(req.body);
  if(error) return res.status(400).send({
   "status":"error",
   "pesan":error.details[0].message,
   "data":[] 
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await NickelContent.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resNickelContent = await nickelContentCon.addNickelContent(session, req.user, dataJson[1]);
  if (resNickelContent[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resNickelContent[0]).send({
      "status":"error",
      "pesan":resNickelContent[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resNickelContent[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetNickelContent = await nickelContentCon.getNickelContent();
  if (resGetNickelContent[0] !== 200) return res.status(resGetNickelContent[0]).send({
    "status": "error",
    "pesan": resGetNickelContent[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetNickelContent[1]
  });
});

// Edit
router.put('/1/:nickel_content_code', Auth, async(req, res) => {
  const { error } = validateNickelContentEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);
  const resUpdateNickelContent = await nickelContentCon.editNickelContent(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateNickelContent[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateNickelContent[0]).send({
      "status": "error",
      "pesan": resUpdateNickelContent[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateNickelContent[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:nickel_content_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);
  const resDelNickelContent = await nickelContentCon.deleteNickelContent(session, req.user, dataParams[1] );
  if( resDelNickelContent[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelNickelContent[0]).send({
      "status": "error",
      "pesan": resDelNickelContent[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelNickelContent[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  MaterialMetalTitle,
  validateMaterialMetalTitleAdd,
  validateMaterialMetalTitleEdit
} = require('../../models/masters/material-metal-title-mdl');

const materialMetalTitleCon = require('../../controlers/masters/material-metal-title-con');

// Simpan
router.post('/material-metal-title', Auth, async(req, res) => {
  const { error } = validateMaterialMetalTitleAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await MaterialMetalTitle.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resMaterialMetalTitle = await materialMetalTitleCon.addMaterialMetalTitle(session, req.user, dataJson[1]);
  if (resMaterialMetalTitle[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resMaterialMetalTitle[0]).send({
      "status":"error",
      "pesan":resMaterialMetalTitle[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resMaterialMetalTitle[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resMaterialMetalTitle = await materialMetalTitleCon.getMaterialMetalTitle();
  if (resMaterialMetalTitle[0] !== 200) return res.status(resMaterialMetalTitle[0]).send({
    "status": "error",
    "pesan": resMaterialMetalTitle[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resMaterialMetalTitle[1]
  });
});

// Edit
router.put('/1/:metal_title_code', Auth, async(req, res) => {
  const { error } = validateMaterialMetalTitleEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateMaterialMetalTitle = await materialMetalTitleCon.editMaterialMetalTitle(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateMaterialMetalTitle[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateMaterialMetalTitle[0]).send({
      "status": "error",
      "pesan": resUpdateMaterialMetalTitle[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateMaterialMetalTitle[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:metal_title_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelMaterialMetalTitle = await materialMetalTitleCon.deleteMaterialMetalTitle(session, req.user, dataParams[1] );
  if( resDelMaterialMetalTitle[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelMaterialMetalTitle[0]).send({
      "status": "error",
      "pesan": resDelMaterialMetalTitle[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelMaterialMetalTitle[1],
    "data": [{}]
  });
});

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  MaterialType,
  validateMaterialTypeAdd,
  validateMaterialTypeEdit
} = require('../../models/masters/material-type-mdl');

const materialTypeCon = require('../../controlers/masters/material-type-con');

// Simpan
router.post('/material-type', Auth, async(req, res) => {
  const { error } = validateMaterialTypeAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await MaterialType.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resMaterial = await materialTypeCon.addMaterialType(session, req.user, req.body);
  if (resMaterial[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resMaterial[0]).send({
      "status":"error",
      "pesan":resMaterial[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resMaterial[1],
    "data":[]
  });
});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetMaterialType = await materialTypeCon.getMaterialType();
  if (resGetMaterialType[0] !== 200) return res.status(resGetMaterialType[0]).send({
    "status": "error",
    "pesan": resGetMaterialType[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetMaterialType[1]
  });
});

// Edit
router.put('/1/:material_type_code', Auth, async(req, res) => {
  const { error } = validateMaterialTypeEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateMaterialType = await materialTypeCon.editMaterialType(session, req.user, req.params, dataJson[1]);
  if ( resUpdateMaterialType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateMaterialType[0]).send({
      "status": "error",
      "pesan": resUpdateMaterialType[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateMaterialType[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:material_type_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelMaterialType = await materialTypeCon.deleteMaterialType(session, req.user, req.params );
  if( resDelMaterialType[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelMaterialType[0]).send({
      "status": "error",
      "pesan": resDelMaterialType[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelMaterialType[1],
    "data": [{}]
  });
});

module.exports = router;
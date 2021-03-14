const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../../middleware/auth');
const { trimUcaseJSON } = require('../../../middleware/function');

const { 
  Area,
  validateAreaAdd,
  validateAreaEdit
} = require('../../../models/masters/region/area-mdl');

const areaCon = require('../../../controlers/masters/region/area-con');

// Simpan
router.post('/area', async(req, res) => {
  const { error } = validateAreaAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await Area.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resArea = await areaCon.addArea(session, req.user, dataJson[1]);
  
  if (resArea[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resArea[0]).send(resArea[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resArea[1]);
});

// Tampil Semua
router.get('/', async(req, res) => {
  const resGetArea = await areaCon.getArea();
  if (resGetArea[0] !== 200) return res.status(resGetArea[0]).send({
    "status": "error",
    "pesan": resGetArea[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetArea[1]
  });
});

// Edit
router.put('/1/:id_area', async(req, res) => {
  const { error } = validateAreaEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateArea = await areaCon.editArea(session, req.user, req.params, dataJson[1]);
  if ( resUpdateArea[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateArea[0]).send({
      "status": "error",
      "pesan": resUpdateArea[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateArea[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:id_area', async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelArea = await areaCon.deleteArea(session, req.user, req.params );
  if( resDelArea[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelArea[0]).send({
      "status": "error",
      "pesan": resDelArea[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelArea[1],
    "data": [{}]
  });
});

module.exports = router;
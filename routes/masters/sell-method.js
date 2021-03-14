const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  SellMethod,
  validateSellMethodAdd,
  validateSellMethodEdit
} = require('../../models/masters/sell-method-mdl');

const sellMethodCon = require('../../controlers/masters/sell-method-con');

// Simpan
router.post('/sell-method', Auth, async(req, res) => {
  const { error } = validateSellMethodAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await SellMethod.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resSellMethod = await sellMethodCon.addSellMethod(session, req.user, dataJson[1]);
  if (resSellMethod[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resSellMethod[0]).send(resSellMethod[1]);
  }

  await session.commitTransaction();
  session.endSession();
  return res.send(resSellMethod[1]);

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetSellMethod = await sellMethodCon.getSellMethod();
  if (resGetSellMethod[0] !== 200) return res.status(resGetSellMethod[0]).send({
    "status": "error",
    "pesan": resGetSellMethod[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetSellMethod[1]
  });
});

// Edit
router.put('/1/:sell_method_code', Auth, async(req, res) => {
  const { error } = validateSellMethodEdit(req.body);
  if ( error ) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateSellMethod = await sellMethodCon.editSellMethod(session, req.user, req.params, dataJson[1]);
  if ( resUpdateSellMethod[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateSellMethod[0]).send({
      "status": "error",
      "pesan": resUpdateSellMethod[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateSellMethod[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:sell_method_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelSellMethod = await sellMethodCon.deleteSellMethod(session, req.user, req.params );
  if( resDelSellMethod[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelSellMethod[0]).send({
      "status": "error",
      "pesan": resDelSellMethod[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelSellMethod[1],
    "data": [{}]
  });
});

module.exports = router;
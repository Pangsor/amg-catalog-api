const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { nsiAuth,Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  ItemCode,
  validateItemCodeAdd,
  validateItemCodeEdit
} = require('../../models/masters_line/item-code-mdl');

const itemCodeCon = require('../../controlers/masters_line/item-code-con');

// Simpan
router.post('/item-code',Auth, async(req, res) => {
  const { error } = validateItemCodeAdd(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await ItemCode.createCollection();

  var dataJson = trimUcaseJSON(req.body.code,[]);
  const resItem = await itemCodeCon.addItemCode(session, req.user, dataJson[1]);
  if (resItem[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resItem[0]).send({
      "status":"error",
      "pesan":resItem[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resItem[1],
    "data":[]
  });
});

// Tampil Semua (OPEN)
router.get('/all-open/:limit_from&:limit_item', Auth, async(req, res) => {
  const filterGet = ({
    "filter": "all-open",
    "value": req.params
  });

  const resGetItem = await itemCodeCon.getItemCodeAll(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count": resGetItem[2],
  });
});

// Tampil Semua (CLOSE)
router.get('/all-close/:limit_from&:limit_item', Auth, async(req, res) => {
  const filterGet = ({
    "filter": "all-close",
    "value": req.params
  });

  const resGetItem = await itemCodeCon.getItemCodeAll(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count": resGetItem[2],
  });
});

// Tampil Satu
router.get('/1/:code_item', Auth, async(req, res) => {
  const resGetItem = await itemCodeCon.getItemCode(req.user, req.params);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1]
    });
  }
  
});

// Edit
router.put('/1/:code_item', Auth, async(req, res) => {
  const { error } = validateItemCodeEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateItem = await itemCodeCon.editItemCode(session, req.user, req.params, dataJson[1]);
  if ( resUpdateItem[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateItem[0]).send({
      "status": "error",
      "pesan": resUpdateItem[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateItem[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:code_item', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelItem = await itemCodeCon.deleteItemCode(session, req.user, req.params );
  if( resDelItem[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelItem[0]).send({
      "status": "error",
      "pesan": resDelItem[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelItem[1],
    "data": [{}]
  });
});

module.exports = router;
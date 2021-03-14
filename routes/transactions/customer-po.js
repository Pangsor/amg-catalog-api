const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { nsiAuth,Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  TmpPo,
  validateTmpPoAdd,
  validateTmpPoEdit
} = require('../../models/temporary/customer-tmp-po-mdl');

const { 
  CustomerPo,
  validateCustomerPoEdit,
  validateCustomerPoClose,
  validatePoSearchTgl,
  validatePoSearchTglOne
} = require('../../models/transactions/customer-po-mdl');

const { Customer } = require('../../models/masters/customer-mdl');

const custPoCon = require('../../controlers/transactions/customer-po-con');

// Simpan Ke Troli
router.post('/cart',Auth, async(req, res) => {
  const { error } = validateTmpPoAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await TmpPo.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);
  
  const resCart = await custPoCon.addToCart(session, req.user, dataJson[1]);
  if (resCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resCart[0]).send({
      "status":"error",
      "pesan":resCart[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resCart[1],
    "data":[]
  });
});

// Tampil Semua Di Troli
router.get('/cart/:kode_customer', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);

  const resGetCart = await custPoCon.getCart(dataParams[1]);
  if (resGetCart[0] !== 200) return res.status(resGetCart[0]).send({
    "status": "error",
    "pesan": resGetCart[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetCart[1]
  });
});

// Jumlah Item Di Troli
router.get('/cart-count/:kode_customer', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);

  const resGetCart = await custPoCon.getCartCount(dataParams[1]);
  if (resGetCart[0] !== 200) return res.status(resGetCart[0]).send({
    "status": "error",
    "pesan": resGetCart[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": [],
    "count":resGetCart[1]
  });
});

// Edit Item Di Troli
router.put('/cart/1/:kode_customer&:code_item', Auth, async(req, res) => {
  const { error } = validateTmpPoEdit(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdateCart = await custPoCon.editCart(session, req.user, dataParams[1], dataJson[1]);
  if ( resUpdateCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateCart[0]).send({
      "status": "error",
      "pesan": resUpdateCart[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateCart[1],
    "data": [{}]
  });
});

// Delete Per Item Di Troli
router.delete('/cart/1/:kode_customer&:code_item&:metal_title_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelCart = await custPoCon.deleteCart(session, req.user, dataParams[1] );
  if( resDelCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelCart[0]).send({
      "status": "error",
      "pesan": resDelCart[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelCart[1],
    "data": [{}]
  });
});

// Delete Semua Item Di Troli
router.delete('/cart/all/:kode_customer', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelCart = await custPoCon.deleteCartAll(session, req.user, dataParams[1] );
  if( resDelCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelCart[0]).send({
      "status": "error",
      "pesan": resDelCart[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelCart[1],
    "data": [{}]
  });
});

// Simpan PO
router.post('/customer-po/:kode_customer',Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  await CustomerPo.createCollection();
  
  var dataParams = trimUcaseJSON(req.params,[]);
  const resPo = await custPoCon.addPo(session, req.user, dataParams[1]);
  if (resPo[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resPo[0]).send({
      "status":"error",
      "pesan":resPo[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resPo[1],
    "data":[]
  });
});

// Lihat Semua PO Per Customer
router.get('/customer-po/:kode_customer', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);

  const resGetPo = await custPoCon.getPo(dataParams[1]);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Lihat Semua PO Status OPEN
router.get('/customer-po/all/open', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);

  const resGetPo = await custPoCon.getPoAllOpen(dataParams[1]);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Lihat Semua PO Status CLOSE/PROCESS
router.get('/customer-po/all/close', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);

  const resGetPo = await custPoCon.getPoAllClose(dataParams[1]);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Ambil Data Per PO dan Customer Tanpa Lihat Status
router.get('/customer-po/1/:kode_customer&:no_po', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);

  const resGetPo = await custPoCon.getPoOne(dataParams[1]);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Ambil Data Semua PO Per Customer Tanpa Lihat Status + Limit
router.get('/customer-po/close-open/:kode_customer:limit_from&:limit_item', Auth, async(req, res) => {
  const { error } = validatePoSearchTglOne(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const resGetPo = await custPoCon.getPoAll(req.params,req.body);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Ambil Data Semua PO Per Customer Tanpa Lihat Status Tanpa Limit
router.post('/customer-po/close-open/1', Auth, async(req, res) => {
  const { error } = validatePoSearchTglOne(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const resGetPo = await custPoCon.getPoAll(req.params,req.body);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Ambil Data Semua PO Status PROCESS/CLOSE
router.get('/customer-po/all/close-tgl/:limit_from&:limit_item', Auth, async(req, res) => {
  const { error } = validatePoSearchTgl(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const resGetPo = await custPoCon.getPoAllCloseByTgl(req.params,req.body);
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Lihat Semua PO Tanpa Status
router.get('/customer-po/all/open-close', Auth, async(req, res) => {
  const resGetPo = await custPoCon.getPoAllOpenClose();
  if (resGetPo[0] !== 200) return res.status(resGetPo[0]).send({
    "status": "error",
    "pesan": resGetPo[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetPo[1]
  });
});

// Close PO
router.put('/customer-po/1/:no_po', Auth, async(req, res) => {
  const { error } = validateCustomerPoClose(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body.item,[]);
  var dataParams = trimUcaseJSON(req.params,[]);

  const resUpdatePo = await custPoCon.closePo(session, req.user, dataParams[1],dataJson[1]);
  if ( resUpdatePo[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdatePo[0]).send({
      "status": "error",
      "pesan": resUpdatePo[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdatePo[1],
    "data": [{}]
  });
});

// Delete PO (OPEN) Semua Item
router.delete('/customer-po/all-open/:no_po', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelCart = await custPoCon.deletePoAllOpen(session, req.user, dataParams[1] );
  if( resDelCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelCart[0]).send({
      "status": "error",
      "pesan": resDelCart[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelCart[1],
    "data": [{}]
  });
});

// Delete PO (OPEN) Per Item
router.delete('/customer-po/1/:no_po&:code_item&:metal_title_code', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);
  
  const resDelCart = await custPoCon.deletePoOpen(session, req.user, dataParams[1] );
  if( resDelCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelCart[0]).send({
      "status": "error",
      "pesan": resDelCart[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelCart[1],
    "data": [{}]
  });
});

// Delete PO (CLOSE) Semua Item
router.delete('/customer-po/all-close/:no_po', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);

  const resDelCart = await custPoCon.deletePoAllClose(session, req.user, dataParams[1] );
  if( resDelCart[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelCart[0]).send({
      "status": "error",
      "pesan": resDelCart[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelCart[1],
    "data": [{}]
  });
});

module.exports = router;
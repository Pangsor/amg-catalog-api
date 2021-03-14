const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  Customer,
  validateCustomerAdd,
  validateUserAdd,
  validateCustomerEdit,
  validateUserLogin,
  validateChangePassword,
  validateForgetPassword
} = require('../../models/masters/customer-mdl');

const { 
  CustomerView,
  validateCustomerViewAdd,
  validateCustomerViewSearch
} = require('../../models/transactions/customer-view-mdl');

const customerCon = require('../../controlers/masters/customer-con');

// Simpan
router.post('/customer', async(req, res) => {
  const { error } = validateCustomerAdd(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();
  session.startTransaction();

  await Customer.createCollection();

  var dataJson = trimUcaseJSON(req.body,[ "user_id", "email", "password", "retype_password" ]);

  const resCust = await customerCon.addCustomer(session, req.user, dataJson[1]);
  if (resCust[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resCust[0]).send({
      "status": "error",
      "pesan": resCust[1],
      "data": []
    });

  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": []
  });

});

// Register 
router.post('/register-customer', async(req, res) => {
  const { error } = validateCustomerAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan" :error.details[0].message,
    "data":[]
  });
  
  if (req.body.password !== req.body.retype_password) return res.status(400).send({
    "status":"error",
    "pesan":"password dan retype password berbeda!",
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await Customer.createCollection();

  // var dataJson = trimUcaseJSON(req.body,[ "user_id", "email", "password", "retype_password" ]);
  var dataJson = trimUcaseJSON(req.body,[ "email" ]);
  
  const resCust = await customerCon.registerCustomer(session, req.user, dataJson[1]);
  if (resCust[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resCust[0]).send({
      "status": "error",
      "pesan": resCust[1],
      "data": []
    });

  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status": "berhasil",
    "pesan": resCust[1],
    "data": []
  });

});

// Aktivasi email user
router.post('/aktivasi-email/:token', async(req, res) => {
  const resActiv = await customerCon.aktivasiEmail(req.params);
  if(resActiv[0] !== 200) return res.status(resActiv[0]).send({
    "status": "error",
    "pesan": resActiv[1],
    "data": []
  });

  return res.send({
    "status": "berhasil",
    "pesan": "Aktivasi user berhasil.",
    "data": []
  });
});

// Validasi Customer
router.post('/aktivasi-customer/:kode_customer', async(req, res) => {
  const resActiv = await customerCon.validasiCustomer(req.params);
  if(resActiv[0] !== 200) return res.status(resActiv[0]).send({
    "status": "error",
    "pesan": resActiv[1],
    "data": []
  });

  return res.send({
    "status": "berhasil",
    "pesan": "Aktivasi user berhasil.",
    "data": []
  });
});

// Tambah User ID Dalam Satu Customer
router.post('/customer/:kode_customer', async(req, res) => {
  const { error } = validateUserAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan" :error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[ "user_id", "email", "password", "retype_password" ]);

  const resCustomer = await customerCon.addUser(session, req.user, req.params, dataJson[1]);
  if(resCustomer[0] !== 200) return res.status(resCustomer[0]).send({
    "status": "error",
    "pesan": resCustomer[1],
    "data": []
  });

  await session.commitTransaction();
  session.endSession();
  
  return res.send({
    "status": "berhasil",
    "pesan": "berhasil.",
    "data": []
  });
});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resGetCustomer = await customerCon.getCustomer();
  if (resGetCustomer[0] !== 200) return res.status(resGetCustomer[0]).send({
    "status": "error",
    "pesan": resGetCustomer[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetCustomer[1]
  });
});

// Tampil V.2
router.get('/1', Auth, async(req, res) => {
  const resGetCustomer = await customerCon.getCustomer2();
  if (resGetCustomer[0] !== 200) return res.status(resGetCustomer[0]).send({
    "status": "error",
    "pesan": resGetCustomer[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetCustomer[1]
  });
});

// Customer Sudah Verifikasi
router.get('/verifikasi', Auth, async(req, res) => {
  const resGetCustomer = await customerCon.getCustomerVerified();
  if (resGetCustomer[0] !== 200) return res.status(resGetCustomer[0]).send({
    "status": "error",
    "pesan": resGetCustomer[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetCustomer[1]
  });
});

// Customer Sudah Validasi
router.get('/valid', Auth, async(req, res) => {
  const resGetCustomer = await customerCon.getCustomerValid();
  if (resGetCustomer[0] !== 200) return res.status(resGetCustomer[0]).send({
    "status": "error",
    "pesan": resGetCustomer[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetCustomer[1]
  });
});

// Edit
router.put('/1/:user_id', Auth, async(req, res) => {
  const { error } = validateCustomerEdit(req.body);
  if ( error ) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,["email"]);

  const resUpdateCustomer = await customerCon.editCustomer(session, req.user, req.params, dataJson[1]);
  if ( resUpdateCustomer[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateCustomer[0]).send({
      "status": "error",
      "pesan": resUpdateCustomer[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateCustomer[1],
    "data": [{}]
  });
});

// Active Customer
router.put('/1/active/:kode_customer', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);
  const resUpdateCustomer = await customerCon.activeCustomer(session, dataParams[1]);
  if ( resUpdateCustomer[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateCustomer[0]).send({
      "status": "error",
      "pesan": resUpdateCustomer[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateCustomer[1],
    "data": [{}]
  });
});

// Non Active Customer
router.put('/1/non-active/:kode_customer', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);
  const resUpdateCustomer = await customerCon.nonActiveCustomer(session, dataParams[1]);
  if ( resUpdateCustomer[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateCustomer[0]).send({
      "status": "error",
      "pesan": resUpdateCustomer[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateCustomer[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:kode_customer', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelCustomer = await customerCon.deleteCustomer(session, req.user, req.params );
  if( resDelCustomer[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelCustomer[0]).send({
      "status": "error",
      "pesan": resDelCustomer[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelCustomer[1],
    "data": [{}]
  });
});

// Login
router.post('/login-user', async(req, res) => {
  const { error } = validateUserLogin(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  var dataBody = trimUcaseJSON(req.body,[]);
  const resLogin = await customerCon.loginUser(dataBody[1]);

  if (resLogin[0] !== 200) return res.status(resLogin[0]).send({
    "status": "error",
    "pesan": resLogin[1],
    "data": [{}]
  });

  return res.send({
    "status": "berhasil",
    "pesan": "Check your email for the OTP",
    "data": [resLogin[1]]
  });

});

// Verifikasi Kode OTP
router.post('/verifying-otp/:email', async(req, res) => {
  const resVerify = await  customerCon.validateOTP(req.params, req.body);
  if(resVerify[0] !== 200) return res.status(resVerify[0]).send({
    "status": "error",
    "pesan": resVerify[1],
    "data": []   
  });

  return res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resVerify[1]
  });
});

// Resend OTP Email
router.post('/resend-otp/:email', async (req, res) => {
  const resSend = await customerCon.reSendKodeOtp(req.params);
  if(resSend[0] !== 200) return res.status(resSend[0]).send({
    "status": "error",
    "pesan": resSend[1],
    "data": []   
  });

  return res.send({
    "status": "berhasil",
    "pesan": resSend[2],
    "data": [resSend[1]]   
  });
});

// Forget Password | OTP Email
router.post('/forget-password', async (req, res) => {
  const { error } = validateForgetPassword(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const resSend = await customerCon.reSendKodeOtp2(req.body);
  if(resSend[0] !== 200) return res.status(resSend[0]).send({
    "status": "error",
    "pesan": resSend[1],
    "data": []   
  });

  return res.send({
    "status": "berhasil",
    "pesan": resSend[2],
    "data": [resSend[1]]   
  });
});

// Verifikasi Kode OTP | Forget Password
router.post('/forget-password/verifying-otp/:email', async(req, res) => {
  const resVerify = await  customerCon.validateOTP(req.params, req.body);
  if(resVerify[0] !== 200) return res.status(resVerify[0]).send({
    "status": "error",
    "pesan": resVerify[1],
    "data": []   
  });

  return res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resVerify[1]
  });
});

// Change password
router.put('/change-password/:user_id', Auth, async(req, res) => {
  const { error } = validateChangePassword(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  const resChange = await customerCon.changePassword(session, req.user,req.params, req.body);
  if (resChange[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resChange[0]).send({
      "status": "error",
      "pesan": resChange[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resChange[1],
    "data": [{}]
  });
});

// Customer View Product
router.post('/view', Auth, async(req, res) => {
  const { error } = validateCustomerViewAdd(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);
  
  await CustomerView.createCollection();

  const resView = await customerCon.addViewProduct(session, dataJson[1] );
  if( resView[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resView[0]).send({
      "status": "error",
      "pesan": resView[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resView[1],
    "data": [{}]
  });
});

// Dashboard Customer Aktif Berdasar View Product
router.get('/aktif/:limit_from&:limit_item', Auth, async(req, res) => {
  
  if (Number(req.params.limit_from).toString() === "NaN") return res.status(400).send({
    "status":"error",
    "pesan":"Limit from must be a number!",
    "data":[]
  });
  if (Number(req.params.limit_item).toString() === "NaN") return res.status(400).send({
    "status":"error",
    "pesan":"Limit item must be a number!",
    "data":[]
  });

  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "aktif",
    "value": dataParams[1]
  });

  const resCust = await customerCon.customerAktif(filterGet);
  if (resCust[0] !== 200) return res.status(resCust[0]).send({
    "status": "error",
    "pesan": resCust[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resCust[1],
    "count": resCust[2]
  });
});

// Dashboard Customer Aktif Berdasar View Product
router.get('/region-aktif/:limit_from&:limit_item', Auth, async(req, res) => {
  
  if (Number(req.params.limit_from).toString() === "NaN") return res.status(400).send({
    "status":"error",
    "pesan":"Limit from must be a number!",
    "data":[]
  });
  if (Number(req.params.limit_item).toString() === "NaN") return res.status(400).send({
    "status":"error",
    "pesan":"Limit item must be a number!",
    "data":[]
  });

  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "aktif",
    "value": dataParams[1]
  });

  const resCust = await customerCon.regionAktif(filterGet);
  if (resCust[0] !== 200) return res.status(resCust[0]).send({
    "status": "error",
    "pesan": resCust[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resCust[1],
    "count": resCust[2]
  });
});

module.exports = router;
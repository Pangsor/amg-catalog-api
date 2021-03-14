const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { nsiAuth, Auth } = require('../../middleware/auth');

const userCon = require('../../controlers/masters/user-con');

// Create super user auth nsi
router.post('/super-user', nsiAuth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resCreate = await userCon.createSuperUser(session, req.user);
  if (resCreate[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resCreate[0]).send(resCreate[1]);
  }

  await session.commitTransaction();
  session.endSession();
  res.send('Create super user success !');
});

// Get all data user
router.get('/', Auth, async(req, res) => {
  const resGetUser = await userCon.getUser();
  if (resGetUser[0] !== 200) return res.status(resGetUser[0]).send({
    "status": "error",
    "pesan": resGetUser[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetUser[1]
  });
});

// Login user
router.post('/login-user', async(req, res) => {
  const resLogin = await userCon.loginUser(req.body);
  if (resLogin[0] !== 200) return res.status(resLogin[0]).send({
    "status": "error",
    "pesan": resLogin[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": [resLogin[1]]
  });
});

// Create user
router.post('/', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resAddUser = await userCon.addUser(session, req.user, req.body);
  if(resAddUser[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resAddUser[0]).send({
      "status": "error",
      "pesan": resAddUser[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resAddUser[1],
    "data": [{}]
  });
});

// Edit user
router.put('/1/:user_id', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resUpdateUser = await userCon.editUser(session, req.user, req.params, req.body);
  if ( resUpdateUser[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateUser[0]).send({
      "status": "error",
      "pesan": resUpdateUser[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateUser[1],
    "data": [{}]
  });
});

// Change password
router.put('/password', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resChange = await userCon.changePassword(session, req.user, req.body);
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

// Delete user
router.delete('/1/:user_id', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelUser = await userCon.deleteUser(session, req.user, req.params );
  if( resDelUser[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelUser[0]).send({
      "status": "error",
      "pesan": resDelUser[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelUser[1],
    "data": [{}]
  });
});

module.exports = router;
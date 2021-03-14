const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const patchDataCon = require('../../controlers/params/patch-data-con');

router.put('/sample_type', Auth, async(req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateItem = await patchDataCon.editSampleType(session, dataJson[1]);
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

module.exports = router;
const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  Banner,
  validateBannerAdd,
  validateBannerEdit,
  validateSearchDetailBanner
} = require('../../models/masters/banner-mdl');

const bannerCon = require('../../controlers/masters/banner-con');
const itemCon = require('../../controlers/masters_line/item-con');

// Simpan
router.post('/banner', Auth, async(req, res) => {
  const { error } = validateBannerAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await Banner.createCollection();

  var dataJson = trimUcaseJSON(req.body,["lokasi_gambar"]);
  const resBanner = await bannerCon.addBanner(session, req.user, dataJson[1]);
  if (resBanner[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resBanner[0]).send({
      "status":"error",
      "pesan":resBanner[1],
      "data":[]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resBanner[1],
    "data":[]
  });

});

// Tampil Semua
router.get('/', Auth, async(req, res) => {
  const resBanner = await bannerCon.getBanner();
  if (resBanner[0] !== 200) return res.status(resBanner[0]).send({
    "status": "error",
    "pesan": resBanner[1],
    "data": [{}]
  });

  if (resBanner[1].length > 0) {
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resBanner[1]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "Data tidak ditemukan!",
      "data": resBanner[1]
    });
  }
  
});

// Delete
router.delete('/1/:kode_banner', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  var dataParams = trimUcaseJSON(req.params,[]);
  const resBanner = await bannerCon.deleteBanner(session, dataParams[1] );
  if( resBanner[0] !== 200) {
      await session.abortTransaction();
      session.endSession();
      return res.status(resBanner[0]).send({
      "status": "error",
      "pesan": resBanner[1],
      "data": [{}]
      })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
      "status": "berhasil",
      "pesan": resBanner[1],
      "data": [{}]
  });
});

// Edit
router.put('/1/:kode_banner', Auth, async(req, res) => {
  const { error } = validateBannerAdd(req.body);
  if(error) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  var dataParams = trimUcaseJSON(req.params,[]);
  var dataJson = trimUcaseJSON(req.body,["lokasi_gambar"]);

  const session = await mongoose.startSession();
  session.startTransaction();

  const resBanner = await bannerCon.editBanner(session,req.user, dataParams[1],dataJson[1] );
  if( resBanner[0] !== 200) {
      await session.abortTransaction();
      session.endSession();
      return res.status(resBanner[0]).send({
      "status": "error",
      "pesan": resBanner[1],
      "data": [{}]
      })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
      "status": "berhasil",
      "pesan": resBanner[1],
      "data": [{}]
  });
});

// Detail Banner Mobile
router.post('/1/detail', Auth, async(req, res) => {
  const { error } = validateSearchDetailBanner(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "detail_banner_mobile",
    "value": dataJson[1]
  });

  const resBanner = await itemCon.getItemShowroom(filterGet);
  if (resBanner[0] !== 200) return res.status(resBanner[0]).send({
    "status": "error",
    "pesan": resBanner[1],
    "data": [{}]
  });
  
  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resBanner[1],
    "count":resBanner[2]
  });
});

// Detail Banner Admin
router.get('/1/detail-admin/:kode_banner&:limit_from&:limit_item', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "detail_banner_admin",
    "value": dataParams[1]
  });
  const resBanner = await itemCon.getItemShowroom(filterGet);
  if (resBanner[0] !== 200) return res.status(resBanner[0]).send({
    "status": "error",
    "pesan": resBanner[1],
    "data": [{}]
  });
  
  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resBanner[1],
    "count":resBanner[2]
  });
});
  
module.exports = router;
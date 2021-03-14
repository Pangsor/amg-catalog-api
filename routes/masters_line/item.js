const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../../middleware/auth');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  Item,
  Hashtag,
  validateItemAdd,
  validateItemEdit,
  validateSearchByItemname,
  validateSearchByItemname2,
  validateSearchByHashtag,
  validateSearchListHashtag,
  validateListCategory,
  validateSearchByCategory,
  validateSearchByPrice,
  validateSearchByTagName,
  validateSearchByPriceWeight,
  validateSearchLine,
  validateRegisterSR
} = require('../../models/masters_line/item-mdl');

const itemCon = require('../../controlers/masters_line/item-con');
const { dateNow, convertDate } = require('../../middleware/convertdate');
const { date } = require('@hapi/joi');

// Simpan
router.post('/item',Auth, async(req, res) => {
  const { error } = validateItemAdd(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
    
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  await Item.createCollection();
  await Hashtag.createCollection();

  var dataJson = trimUcaseJSON(req.body,[]);
  
  const resItem = await itemCon.addItem(session, req.user, dataJson[1]);
  if (resItem[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resItem[0]).send({
      "status":"error",
      "pesan":resItem[1],
      "data":[{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  return res.send({
    "status":"berhasil",
    "pesan":resItem[1],
    "data":[{}]
  });

});

// Tampil Semua Di Line (Admin)
router.get('/all', Auth, async(req, res) => {
  const resGetItem = await itemCon.getItemAll();
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

// Tampil Semua/Open/Valid/Range Berat Di Line (Admin)
router.get('/line', Auth, async(req, res) => {
  const { error } = validateSearchLine(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "all",
    "value": dataJson[1]
  });
  
  const resGetItem = await itemCon.getItem(filterGet);
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

// DashBoard Master Line (Admin)
router.get('/:limit_from&:limit_item', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "dashboard-admin",
    "value": dataParams[1]
  });
  
  const resGetItem = await itemCon.getItem(filterGet);
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

// Cari Per Item Name Di Line (Admin)
router.get('/item_name/:item_name&:limit_from&:limit_item', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "item_name",
    "value": dataParams[1]
  });

  const resGetItem = await itemCon.getItem(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Search By Category in master line (Admin)
router.get('/sample_type_name/:sample_type_name&:limit_from&:limit_item', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "sample_type_name",
    "value": dataParams[1]
  });

  const resGetItem = await itemCon.getItem(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Tampil Satu Di Line
router.get('/1/:code_item', Auth, async(req, res) => {
  const resGetItem = await itemCon.getItemOne(req.params);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1]
  });
});

// Tampil Semua Di Showroom (Admin)
router.get('/showroom/:limit_from&:limit_item', Auth, async(req, res) => {
  const filterGet = ({
    "filter": "all-admin",
    "value": req.params
  });
  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count":resGetItem[2]
  });
});

// Tampil Semua Di Showroom (Mobile)
router.get('/showroom/m/:limit_from&:limit_item&:kode_customer&:negara', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "all-mobile",
    "value": dataParams[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count":resGetItem[2]
  });
});

// Berdasar Terakhir Masuk Ke Showroom
router.get('/showroom/last/:limit_from&:limit_item', Auth, async(req, res) => {
  const filterGet = ({
    "filter": "all-last",
    "value": req.params
  });
  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count":resGetItem[2]
  });
});

// Barang Lama Di Showroom
router.get('/showroom/old/:limit_from&:limit_item&:kode_customer&:negara', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "all-old",
    "value": dataParams[1]
  });
  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });
 
  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }
  
});

// Barang Baru Di Showroom
router.get('/showroom/new/:limit_from&:limit_item&:kode_customer&:negara', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "all-new",
    "value": dataParams[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }
  
});

// Cari Per Item Name Di Showroom (Admin)
router.get('/showroom/item_name/:item_name&:limit_from&:limit_item', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "item_name_admin",
    "value": dataParams[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Cari Per Item Name Di Showroom (Mobile)
router.post('/showroom/item_name', Auth, async(req, res) => {
  const { error } = validateSearchByItemname2(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "item_name",
    "value": dataJson[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Cari Berdasar Hashtag Di Showroom
router.post('/showroom/hashtag', Auth, async(req, res) => {
  const { error } = validateSearchByHashtag(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  
  const filterGet = ({
    "filter": "hashtag",
    "value": dataJson[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count": resGetItem[2]
  });
});

// Cari Berdasar Item Name Atau Hashtag Di Showroom
router.post('/showroom/name-hashtag', Auth, async(req, res) => {
  let tmpFilter = "";

  const { error } = validateSearchByTagName(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  tmpFilter = dataJson[1].contents;
  if (tmpFilter.substring(0,1) === "#") {
    tmpFilter = "hashtag";
  }else{
    tmpFilter = "item_name";
  }
  const filterGet = ({
    "filter": tmpFilter,
    "value": dataJson[1]
  });
  
  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1],
    "count": resGetItem[2]
  });
});

// Cari Per Kategori Di Showroom (Mobile)
router.post('/showroom/category', Auth, async(req, res) => {
  const { error } = validateSearchByCategory(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "category-mobile",
    "value": dataJson[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Cari Berdasar Harga Di Showroom (Mobile)
router.post('/showroom/price', Auth, async(req, res) => {
  const { error } = validateSearchByPrice(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "tukaran-mobile",
    "value": dataJson[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Cari Berdasar Berat Di Showroom (Mobile)
router.post('/showroom/weight', Auth, async(req, res) => {
  const { error } = validateSearchByPrice(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "weight-mobile",
    "value": dataJson[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Cari Berdasar Berat-Harga Di Showroom (Mobile)
router.post('/showroom/weight-price', Auth, async(req, res) => {
  const { error } = validateSearchByPriceWeight(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataJson = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "tukaran-mobile",
    "value": dataJson[1]
  });

  const resGetItem = await itemCon.getItemShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  if (resGetItem[1].length > 0){
    res.send({
      "status": "berhasil",
      "pesan": "berhasil",
      "data": resGetItem[1],
      "count": resGetItem[2]
    });
  }else{
    res.send({
      "status": "berhasil",
      "pesan": "data tidak ditemukan",
      "data": resGetItem[1],
      "count":resGetItem[2]
    });
  }

});

// Detail Product Di Showroom
router.get('/showroom-detail/:code_item', Auth, async(req, res) => {
  const resGetItem2 = await itemCon.getDetailShowroom(req.user, req.params);
  if (resGetItem2[0] !== 200) return res.status(resGetItem2[0]).send({
    "status": "error",
    "pesan": resGetItem2[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem2[1]
  });
});

// Detail Deskripsi Product Di Showroom
router.get('/showroom-deskripsi/:code_item', Auth, async(req, res) => {
  const resGetItem2 = await itemCon.getDetailDeskripsiShowroom(req.user, req.params);
  if (resGetItem2[0] !== 200) return res.status(resGetItem2[0]).send({
    "status": "error",
    "pesan": resGetItem2[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem2[1]
  });
});

// Get Data Barang Per Barang Per Metal Title Code
router.get('/showroom-weight/:code_item&:metal_title_code', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  
  const filterGet = ({
    "value": dataParams[1]
  });
  
  const resGetItem = await itemCon.getWeightShowroom(filterGet);
  if (resGetItem[0] !== 200) return res.status(resGetItem[0]).send({
    "status": "error",
    "pesan": resGetItem[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem[1]
  });
});

// Daftar Hashtag
router.get('/showroom-hashtag/', Auth, async(req, res) => {
  const resGetItem2 = await itemCon.getShowroomHashtag();
  if (resGetItem2[0] !== 200) return res.status(resGetItem2[0]).send({
    "status": "error",
    "pesan": resGetItem2[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem2[1]
  });
});

// Daftar Hashtag
router.post('/showroom/list-hashtag', Auth, async(req, res) => {
  const { error } = validateSearchListHashtag(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
  });

  var dataBody = trimUcaseJSON(req.body,[]);
  const filterGet = ({
    "filter": "all",
    "value": dataBody[1]
  });

  const resHashtag = await itemCon.getListHashtag(filterGet);
  if (resHashtag[0] !== 200) return res.status(resHashtag[0]).send({
    "status": "error",
    "pesan": resHashtag[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resHashtag[1],
    "count":resHashtag[2]
  });
});

// Daftar Kategori
router.get('/showroom/list-category/:kode_customer&:negara', Auth, async(req, res) => {
  var dataParams = trimUcaseJSON(req.params,[]);
  const filterGet = ({
    "filter": "list-category-mobile",
    "value": dataParams[1]
  });
  
  const resGetItem2 = await itemCon.getItemShowroom(filterGet);
  if (resGetItem2[0] !== 200) return res.status(resGetItem2[0]).send({
    "status": "error",
    "pesan": resGetItem2[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetItem2[1]
  });
});

// Edit
router.put('/1/:code_item', Auth, async(req, res) => {
  const { error } = validateItemEdit(req.body);
  if(error) return res.status(400).send({
    "status": "error",
    "pesan": error.details[0].message,
    "data": [{}]
    
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  var dataJson = trimUcaseJSON(req.body,[]);

  const resUpdateItem = await itemCon.editItem(session, req.user, req.params, dataJson[1]);
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
  return res.send({
    "status": "berhasil",
    "pesan": resUpdateItem[1],
    "data": [{}]
  });
});

// Delete
router.delete('/1/:code_item', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelItem = await itemCon.deleteItem(session, req.user, req.params );
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

// Daftar Ke Showroom
router.put('/register/:code_item', Auth, async(req, res) => {
  var tmpParams = trimUcaseJSON(req.params,[])
  
  dataParams =[tmpParams[1]]

  const session = await mongoose.startSession();
  session.startTransaction();

  const resUpdateShowroom = await itemCon.addShowroom(session, req.user, dataParams);
  if ( resUpdateShowroom[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateShowroom[0]).send({
      "status": "error",
      "pesan": resUpdateShowroom[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateShowroom[1],
    "data": [{}]
  });
});

// Daftar Ke Showroom (multi item) 
router.put('/registers/code_item', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { error } = validateRegisterSR(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  var dataJson = trimUcaseJSON(req.body.code,[]);
  const resUpdateShowroom = await itemCon.addShowroom(session, req.user, dataJson[1]);
  if ( resUpdateShowroom[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateShowroom[0]).send({
      "status": "error",
      "pesan": resUpdateShowroom[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateShowroom[1],
    "data": [{}]
  });
});

// Hapus Di Showroom
router.put('/unregister/:code_item', Auth, async(req, res) => {
  var tmpParams = trimUcaseJSON(req.params,[])  
  dataParams =[tmpParams[1]]

  const session = await mongoose.startSession();
  session.startTransaction();

  const resUpdateShowroom = await itemCon.deleteShowroom(session, req.user, dataParams);
  if ( resUpdateShowroom[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateShowroom[0]).send({
      "status": "error",
      "pesan": resUpdateShowroom[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateShowroom[1],
    "data": [{}]
  });
});

// Hapus Di Showroom (multi item)
router.put('/unregisters/code_item', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { error } = validateRegisterSR(req.body);
  if ( error ) return res.status(400).send({
    "status":"error",
    "pesan":error.details[0].message,
    "data":[]
  });

  var dataJson = trimUcaseJSON(req.body.code,[]);
  const resUpdateShowroom = await itemCon.deleteShowroom(session, req.user, dataJson[1]);
  if ( resUpdateShowroom[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateShowroom[0]).send({
      "status": "error",
      "pesan": resUpdateShowroom[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateShowroom[1],
    "data": [{}]
  });
});

module.exports = router;
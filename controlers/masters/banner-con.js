const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON
} = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');
const { trimUcaseJSON } = require('../../middleware/function');

const { 
  Banner, 
  fieldsBanner
} = require('../../models/masters/banner-mdl');
const { 
    Item,
    fieldsItem
  } = require('../../models/masters_line/item-mdl');

async function addBanner(session, dataUser, dataBody) {
  let tmpDetailCode = "";
  let arrBanner = [];
  let arrBanner2 = [];
  let arrHashtag = [];
  let tmpCodeItem = "";

  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let banner = await Banner.findOne({ kode_banner:encBody.kode_banner });
  if (banner) return [400,`Kode sudah terdaftar!`];

  if (dataBody.category === "ITEM"){

  } else if (dataBody.category === "HASHTAG") {

  }else{
    return [400, `Pilih Category Item Atau Hashtag!`]
  }

  var dataDetailCode = trimUcaseJSON(dataBody.detail_code,[]);
  var dataDetailHashtag = trimUcaseJSON(dataBody.detail_hashtag,[]);

  const resEncCode = encryptJSON(dataDetailCode[1]);
  if (resEncCode[0] !== 200){
    return resEncCode;
  }
  const encCode = resEncCode[1];

  const resEncHashtag = encryptJSON(dataDetailHashtag[1]);
  if (resEncHashtag[0] !== 200){
    return resEncHashtag;
  }
  const encHashtag = resEncHashtag[1];

  if (dataBody.category === "ITEM"){
    for (let i in encCode){
      
      let item03 = await Item.findOne({
        code_item:encCode[i].code_item,
        status_show:encryptText("VALID")
      });
      if (!item03) return  [400,`Item ${decryptText(encCode[i].code_item)} not found!`];

      arrBanner = item03.deskripsi_banner;
      arrBanner.push(encBody.kode_banner)
      
      item03.deskripsi_banner = arrBanner;
      await item03.save({ session: session });

    }
  }
  
  if (dataBody.category === "HASHTAG"){
    for (let i in encHashtag){

      let item03 = await Item.find({
        "hashtag": {
          $in: [ encHashtag[i].hashtag ]
        }
      });
      if (!item03) return  [400,`Item ${decryptText(encHashtag[i].hashtag)} not found!`];

      arrHashtag.push(encHashtag[i].hashtag)
      if (item03.length > 0){
        
      }else{
        return  [400,`Hashtag ${decryptText(encHashtag[i].hashtag)} not found!`];
      }
      
      for (let j in item03){
        arrBanner = item03[j].deskripsi_banner;
        arrBanner.push(encBody.kode_banner)
        tmpCodeItem = item03[j].code_item
        
        let item04 = await Item.findOneAndUpdate({ code_item: tmpCodeItem },
          {
            deskripsi_banner: arrBanner
        },{ session: session });
        if (!item04) return [404, `Data Item tidak di temukan!`];

      }
      
    }
  }

  banner = new Banner({
    "kode_banner": encBody.kode_banner,
    "deskripsi": encBody.deskripsi,
    "kode_gambar": encBody.kode_gambar,
    "lokasi_gambar": encBody.lokasi_gambar,
    "category": encBody.category,
    "hashtag":arrHashtag,
    "input_by":dataUser.user_id,
    "input_date":dateNow(),
    "edit_by":encryptText("-")
  });
  
  await banner.save({ session: session });
  
  return [200, "Data Banner berhasil di simpan!"]; 
}

// Hapus Banner
async function deleteBanner(session, dataParams) {
  let arrBanner = [];
  let tmpCodeItem = "";

  const banner = await Banner.findOneAndRemove({
    kode_banner: encryptText(dataParams.kode_banner)
  }, { session: session });
  if (!banner) return [404, `Deskripsi tidak di temukan!`];
   
  let item01 = await Item.find({
    "deskripsi_banner": {
      $in: [ encryptText(dataParams.kode_banner) ]
    }
  });
  // if (!item01) return  [400,`Item not found!`];

  if (item01.length > 0){
    for (let i in item01){
      tmpCodeItem = item01[i].code_item
      arrBanner = item01[i].deskripsi_banner;
      const index = arrBanner.findIndex(kode_banner => kode_banner === encryptText(dataParams.kode_banner));
      
      if (index > 0){
        arrBanner.splice(index,1)
      }
  
      let item02 = await Item.findOneAndUpdate({ code_item: tmpCodeItem },
        {
          deskripsi_banner: arrBanner
      },{ session: session });
      if (!item02) return [404, `Data Item tidak di temukan!`];
  
    }
  }else{
    // return  [400,`Item not found!`];
  }
  
   

  return [200, "Delete data Banner berhasil!"];
}

// Edit
async function editBanner(session,dataUser, dataParams,dataBody) {
  let arrBanner = [];
  let arrHashtag = [];
  let tmpCodeItem = "";

  let tmpDetailCode = "";
  let arrBanner2 = [];

  if (dataBody.category === "ITEM"){

  } else if (dataBody.category === "HASHTAG") {

  }else{
    return [400, `Pilih Category Item Atau Hashtag!`]
  }

  let banner = await Banner.findOne({
    kode_banner: encryptText(dataParams.kode_banner)
  });
  if (!banner) return  [400,`Deskripsi tidak di temukan!`];
  
  // Hashtag Update
  for (let i in dataBody.detail_hashtag){
    arrHashtag.push(encryptText(dataBody.detail_hashtag[i].hashtag))
  }
  // Hashtag Update
  
  // Cari Ke Master Item
  let item01 = await Item.find({
    "deskripsi_banner": {
      $in: [ encryptText(dataParams.kode_banner) ]
    }
  });
  // if (!item01) return  [400,`Item not found!`];

  if (item01.length > 0){
    for (let i in item01){
      tmpCodeItem = item01[i].code_item
      arrBanner = item01[i].deskripsi_banner;
      const index = arrBanner.findIndex(kode_banner => kode_banner === encryptText(dataParams.kode_banner));
      
      if (index > 0){
        arrBanner.splice(index,1)
      }
  
      let item02 = await Item.findOneAndUpdate({ code_item: tmpCodeItem },
        {
          deskripsi_banner: arrBanner
      },{ session: session });
      if (!item02) return [404, `Data Item tidak di temukan!`];
  
    }
  }else{
    // return  [400,`Item not found!`];
  }
  // End Cari Ke Master Item

  // Update 
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let banner01 = await Banner.findOneAndUpdate({ kode_banner:encBody.kode_banner },
    {
      deskripsi: encBody.deskripsi,
      kode_gambar: encBody.kode_gambar,
      lokasi_gambar: encBody.lokasi_gambar,
      category: encBody.category,
      hashtag: arrHashtag,
  },{ session: session });
  if (!banner01) return [404, `Deskripsi tidak di temukan!`];

  var dataDetailCode = trimUcaseJSON(dataBody.detail_code,[]);
  var dataDetailHashtag = trimUcaseJSON(dataBody.detail_hashtag,[]);

  const resEncCode = encryptJSON(dataDetailCode[1]);
  if (resEncCode[0] !== 200){
    return resEncCode;
  }
  const encCode = resEncCode[1];

  const resEncHashtag = encryptJSON(dataDetailHashtag[1]);
  if (resEncHashtag[0] !== 200){
    return resEncHashtag;
  }
  const encHashtag = resEncHashtag[1];

  if (dataBody.category === "ITEM"){
    for (let i in encCode){
      
      let item03 = await Item.findOne({
        code_item:encCode[i].code_item,
        status_show:encryptText("VALID")
      });
      if (!item03){
        return  [400,`Item ${decryptText(encCode[i].code_item)} not found!`];
      } else{
        arrBanner = item03.deskripsi_banner;
        arrBanner.push(encBody.kode_banner)
        
        item03.deskripsi_banner = arrBanner;
        await item03.save({ session: session });
      }

    }
  }
  
  if (dataBody.category === "HASHTAG"){
    for (let i in encHashtag){

      let item03 = await Item.find({
        "hashtag": {
          $in: [ encHashtag[i].hashtag ]
        }
      });
      // if (!item03) return  [400,`Hashtag ${decryptText(encHashtag[i].hashtag)} not found!`];

      if (item03.length > 0){
        // 
        for (let j in item03){
          arrBanner = item03[j].deskripsi_banner;
          arrBanner.push(encBody.kode_banner)
          tmpCodeItem = item03[j].code_item
          
          let item04 = await Item.findOneAndUpdate({ code_item: tmpCodeItem },
            {
              deskripsi_banner: arrBanner
          },{ session: session });
          if (!item04) return [404, `Data Item tidak di temukan!`];
  
        }
        // 
      }else{
        // return  [400,`Hashtag ${decryptText(encHashtag[i].hashtag)} not found!`];
      }
      
    }
  }

  return [200, "Data Banner berhasil diedit!"];
}

async function getBanner() {
  let banner = await Banner.aggregate([
    { '$project': fieldsBanner }
  ]);

  let resDec = decryptJSON(banner);
  return resDec;
}

async function getItemBanner(dataParams) {
  let item = await Item.aggregate([
    { "$match": {
        "deskripsi_banner": {
          $in : [encryptText(dataParams.kode_banner)]
        }  
      }
    },
    { '$project': fieldsItem }
  ]);

  let resDec = decryptJSON(item);
  return resDec;
}

exports.addBanner = addBanner;
exports.deleteBanner = deleteBanner;
exports.editBanner = editBanner;
exports.getBanner = getBanner;
exports.getItemBanner = getItemBanner;
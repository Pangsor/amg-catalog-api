const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON,
  unMaskedNumber,
  maskedNumber
} = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');

const { cekNumber, trimUcaseJSON } = require('../../middleware/function');
const { pipeline } = require('nodemailer/lib/xoauth2');

const { 
  Item,
  Hashtag,
  fieldsItem,
  fieldsItem2,
  fieldsHashtag
} = require('../../models/masters_line/item-mdl');
const { ItemCode} = require('../../models/masters_line/item-code-mdl');
const { date } = require('@hapi/joi');

async function addItem(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  resCek = cekNumber("width_item", dataBody.width_item);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("height_item", dataBody.height_item);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("depth_item", dataBody.depth_item);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("gauge_item", dataBody.gauge_item);
  if(resCek[0] !== 200) return resCek;

  const encBody22 = dataBody.material;

  const resEncMaterial = encryptJSON(dataBody.material);
  if (resEncMaterial[0] !== 200){
    return resEncMaterial;
  }
  const encMaterial = resEncMaterial[1];

  let item = await Item.findOne({ code_item:encBody.code_item });
  if (item) return [400,`Item sudah terdaftar!`];

  for (let i in dataBody.material){
    resCek = cekNumber("loss", dataBody.material[i].loss);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("kadar", dataBody.material[i].kadar);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("price", dataBody.material[i].price);
    if(resCek[0] !== 200) return resCek;

    for (let j in dataBody.material[i].size){
      resCek = cekNumber("size", dataBody.material[i].size[j].size);
      if(resCek[0] !== 200) return resCek;

      resCek = cekNumber("nett_weight", dataBody.material[i].size[j].nett_weight);
      if(resCek[0] !== 200) return resCek;

      resCek = cekNumber("gross_weight", dataBody.material[i].size[j].gross_weight);
      if(resCek[0] !== 200) return resCek;
    }
    
    resCek = cekNumber("total_nett_weight", dataBody.material[i].total_nett_weight);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("total_gross_weight", dataBody.material[i].total_gross_weight);
    if(resCek[0] !== 200) return resCek;
  }

  // Validasi Stone 
  for (let i in dataBody.stone){
    resCek = cekNumber("stone_price", dataBody.stone[i].stone_price);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_qty", dataBody.stone[i].stone_qty);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_carat_weight", dataBody.stone[i].stone_carat_weight);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_carat_subtotal", dataBody.stone[i].stone_carat_subtotal);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_price_subtotal", dataBody.stone[i].stone_price_subtotal);
    if(resCek[0] !== 200) return resCek;
  }
  // Validasi Stone

  // validasi plating
  for (let k in dataBody.plating){
    resCek = cekNumber("micron", dataBody.plating[k].micron);
    if(resCek[0] !== 200) return resCek;
  }
  // validasi plating

  // validasi chain
  for (let k in dataBody.chaintype){
    resCek = cekNumber("chain_length", dataBody.chaintype[k].chain_length);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_weight", dataBody.chaintype[k].chain_weight);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_extra_detail", dataBody.chaintype[k].chain_extra_detail);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_gauge", dataBody.chaintype[k].chain_gauge);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_width", dataBody.chaintype[k].chain_width);
    if(resCek[0] !== 200) return resCek;
  }
  // validasi chain

  resCek = cekNumber("quote_price", dataBody.quote_price);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("weight_tolerance", dataBody.weight_tolerance);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("sample_lead_time", dataBody.sample_lead_time);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("product_lead_time", dataBody.product_lead_time);
  if(resCek[0] !== 200) return resCek;

  for (let k in dataBody.min_order_qty){
    resCek = cekNumber("units_quote_data", dataBody.min_order_qty[k].units_quote_data);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("grams_quote_data", dataBody.min_order_qty[k].grams_quote_data);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("total_po_value", dataBody.min_order_qty[k].total_po_value);
    if(resCek[0] !== 200) return resCek;
  }
  
  let arrHashtag = [];
  let arrHashtag2 = [];
  let arrTmpMarket = [];
  let arrMarket = [];
  let arrBanner = [encryptText("-")];

  arrHashtag = dataBody.hashtag
  
  for(let i = 0; i < arrHashtag.length; i++){
    arrHashtag2.push(encryptText(arrHashtag[i]))
  }

  arrTmpMarket = dataBody.selected_market
  
  for(let i = 0; i < arrTmpMarket.length; i++){
    arrMarket.push(encryptText(arrTmpMarket[i]))
  }

  item = new Item({
    "code_item": encBody.code_item,
    "item_name": encBody.item_name,
    "gambar":encBody.gambar,
    "gambar360":encBody.gambar360,
    "material_type_code": encBody.material_type_code,
    "sell_method_name": encBody.sell_method_name,
    "sell_currency_name": encBody.sell_currency_name,
    "metalcolour":encBody.metalcolour,
    "sample_type_code": encBody.sample_type_code,
    "category_code": encBody.category_code,
    "qty_code": encBody.qty_code,
    "keywords": encBody.keywords,
    "width_item": encBody.width_item,
    "height_item": encBody.height_item,
    "depth_item": encBody.depth_item,
    "gauge_item": encBody.gauge_item,
    "material": encBody.material,
    "total_nett_weight": encBody.total_nett_weight,
    "total_gross_weight": encBody.total_gross_weight,
    "finishtype":encBody.finishtype,
    "stone":encBody.stone,
    "plating_method_code": encBody.plating_method_code,
    "guaranteed": encBody.guaranteed,
    "plating":encBody.plating,
    "finding":encBody.finding,
    "chaintype":encBody.chaintype,
    "quote_price": encBody.quote_price,
    "weight_tolerance": encBody.weight_tolerance,
    "sample_lead_time": encBody.sample_lead_time,
    "product_lead_time": encBody.product_lead_time,
    "min_order_qty": encBody.min_order_qty,
    "hashtag": arrHashtag2,
    "type_kadar": encBody.type_kadar,
    "kadar": encBody.kadar,
    "price": encBody.price,
    "privacy": encBody.privacy,
    "jenis_privacy": encBody.jenis_privacy,
    "selected_customer": encBody.selected_customer,
    "selected_market": arrMarket,
    "deskripsi_banner":arrBanner,
    "status_active": encryptText("OPEN"),
    "status_show": encryptText("OPEN"),
    "input_by": dataUser.user_id,
    "input_date": dateNow(),
    "edit_by": encryptText("-")
  });

  await item.save({ session: session });

  let itemCode01 = await ItemCode.findOneAndUpdate({ code_item: encBody.code_item },
    {
      status: encryptText("CLOSE")
  },{ session: session });

  for(let j = 0; j < arrHashtag.length; j++){
    let hashtag02 = await Hashtag.findOne({ hashtag:encryptText(arrHashtag[j]) });
    if (!hashtag02){
      hashtag = new Hashtag({
        "hashtag":encryptText(arrHashtag[j])
      });
      await hashtag.save({ session: session });
    }
  }

  return [200, "Data Item berhasil di simpan!"]; 
}

async function editItem(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  resCek = cekNumber("width_item", dataBody.width_item);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("height_item", dataBody.height_item);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("depth_item", dataBody.depth_item);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("gauge_item", dataBody.gauge_item);
  if(resCek[0] !== 200) return resCek;

  for (let i in dataBody.material){
    resCek = cekNumber("loss", dataBody.material[i].loss);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("kadar", dataBody.material[i].kadar);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("price", dataBody.material[i].price);
    if(resCek[0] !== 200) return resCek;

    for (let j in dataBody.material[i].size){
      resCek = cekNumber("size", dataBody.material[i].size[j].size);
      if(resCek[0] !== 200) return resCek;

      resCek = cekNumber("nett_weight", dataBody.material[i].size[j].nett_weight);
      if(resCek[0] !== 200) return resCek;

      resCek = cekNumber("gross_weight", dataBody.material[i].size[j].gross_weight);
      if(resCek[0] !== 200) return resCek;
    }
    
    resCek = cekNumber("total_nett_weight", dataBody.material[i].total_nett_weight);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("total_gross_weight", dataBody.material[i].total_gross_weight);
    if(resCek[0] !== 200) return resCek;
  }

  // Validasi Stone 
  for (let i in dataBody.stone){
    resCek = cekNumber("stone_price", dataBody.stone[i].stone_price);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_qty", dataBody.stone[i].stone_qty);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_carat_weight", dataBody.stone[i].stone_carat_weight);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_carat_subtotal", dataBody.stone[i].stone_carat_subtotal);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("stone_price_subtotal", dataBody.stone[i].stone_price_subtotal);
    if(resCek[0] !== 200) return resCek;
  }
  // Validasi Stone

  // validasi plating
  for (let k in dataBody.plating){
    resCek = cekNumber("micron", dataBody.plating[k].micron);
    if(resCek[0] !== 200) return resCek;
  }
  // validasi plating

  // validasi chain
  for (let k in dataBody.chaintype){
    resCek = cekNumber("chain_length", dataBody.chaintype[k].chain_length);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_weight", dataBody.chaintype[k].chain_weight);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_extra_detail", dataBody.chaintype[k].chain_extra_detail);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_gauge", dataBody.chaintype[k].chain_gauge);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("chain_width", dataBody.chaintype[k].chain_width);
    if(resCek[0] !== 200) return resCek;
  }
  // validasi chain

  resCek = cekNumber("quote_price", dataBody.quote_price);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("weight_tolerance", dataBody.weight_tolerance);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("sample_lead_time", dataBody.sample_lead_time);
  if(resCek[0] !== 200) return resCek;

  resCek = cekNumber("product_lead_time", dataBody.product_lead_time);
  if(resCek[0] !== 200) return resCek;

  for (let k in dataBody.min_order_qty){
    resCek = cekNumber("units_quote_data", dataBody.min_order_qty[k].units_quote_data);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("grams_quote_data", dataBody.min_order_qty[k].grams_quote_data);
    if(resCek[0] !== 200) return resCek;

    resCek = cekNumber("total_po_value", dataBody.min_order_qty[k].total_po_value);
    if(resCek[0] !== 200) return resCek;
  }
  
  let itemCari = await Item.findOne({ code_item:encBody.code_item,status_show: encryptText("OPEN") });
  if (!itemCari) return [400,`Data Item tidak di temukan!`];

  // let tmpBanner = itemCari.deskripsi_banner;
  let tmpStatusActive = itemCari.status_active;
  let tmpStatusShow = itemCari.status_show;
  let tmpInputBy = itemCari.input_by;
  let tmpInputDate = itemCari.input_date;

  let item = await Item.findOneAndRemove({ code_item:encBody.code_item,status_show: encryptText("OPEN") });
  if (!item) return [400,`Data Item tidak di temukan!`];

  let arrHashtag = [];
  let arrHashtag2 = [];
  let arrTmpMarket = [];
  let arrMarket = [];

  arrHashtag = dataBody.hashtag
  
  for(let i = 0; i < arrHashtag.length; i++){
    arrHashtag2.push(encryptText(arrHashtag[i]))
  }

  arrTmpMarket = dataBody.selected_market
  
  for(let i = 0; i < arrTmpMarket.length; i++){
    arrMarket.push(encryptText(arrTmpMarket[i]))
  }

  item = new Item({
    "code_item": encBody.code_item,
    "item_name": encBody.item_name,
    "gambar":encBody.gambar,
    "gambar360":encBody.gambar360,
    "material_type_code": encBody.material_type_code,
    "sell_method_name": encBody.sell_method_name,
    "sell_currency_name": encBody.sell_currency_name,
    "metalcolour":encBody.metalcolour,
    "sample_type_code": encBody.sample_type_code,
    "category_code": encBody.category_code,
    "qty_code": encBody.qty_code,
    "keywords": encBody.keywords,
    "width_item": encBody.width_item,
    "height_item": encBody.height_item,
    "depth_item": encBody.depth_item,
    "gauge_item": encBody.gauge_item,
    "material": encBody.material,
    "total_nett_weight": encBody.total_nett_weight,
    "total_gross_weight": encBody.total_gross_weight,
    "finishtype":encBody.finishtype,
    "stone":encBody.stone,
    "plating_method_code": encBody.plating_method_code,
    "guaranteed": encBody.guaranteed,
    "plating":encBody.plating,
    "finding":encBody.finding,
    "chaintype":encBody.chaintype,
    "quote_price": encBody.quote_price,
    "weight_tolerance": encBody.weight_tolerance,
    "sample_lead_time": encBody.sample_lead_time,
    "product_lead_time": encBody.product_lead_time,
    "min_order_qty": encBody.min_order_qty,
    "hashtag": arrHashtag2,
    "type_kadar": encBody.type_kadar,
    "kadar": encBody.kadar,
    "price": encBody.price,
    "privacy": encBody.privacy,
    "jenis_privacy": encBody.jenis_privacy,
    "selected_customer": encBody.selected_customer,
    "selected_market": arrMarket,
    // "deskripsi_banner":tmpBanner,
    "status_active": tmpStatusActive,
    "status_show": tmpStatusShow,
    "input_by": tmpInputBy,
    "input_date": tmpInputDate,
    "edit_by": dataUser.user_id,
    "edit_date": dateNow()
  });

  await item.save({ session: session });

  for(let j = 0; j < arrHashtag.length; j++){
    let hashtag02 = await Hashtag.findOne({ hashtag:encryptText(arrHashtag[j]) });
    if (!hashtag02){
      hashtag = new Hashtag({
        "hashtag":encryptText(arrHashtag[j])
      });
      await hashtag.save({ session: session });
    }
  }

  return [200, "Edit data Item berhasil!"];
}

async function deleteItem(session, dataUser, dataParams) {
  const item = await Item.findOneAndRemove({
    code_item: encryptText(dataParams.code_item),
    status_show: encryptText("OPEN")
  }, { session: session });
  if (!item) return [404, `Data Item tidak di temukan!`];

  let itemCode01 = await ItemCode.findOneAndUpdate({ code_item: encryptText(dataParams.code_item) },
    {
      status: encryptText("OPEN")
  },{ session: session });
  
  return [200, "Delete data Item berhasil!"];
}

async function getItem(dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  switch (dataBody.filter) {
    case "all":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push(
        { "$lookup": { from: 'tm_sample_type', localField: 'sample_type_code', foreignField: 'sample_type_code', as: 'item'}},
        { "$unwind": "$item"}
      );
      
      if (dataBody.value.category === "ALL"){
        if (dataBody.value.limit_finish_weight > 0){
          
          pipeLineAggregate.push(
            { 
              "$match": { 
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                }
                
              }
            }
          );
        }else{
          
        }
        
      }
      
      if (dataBody.value.category === "ML"){
        if (dataBody.value.limit_finish_weight > 0){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("OPEN"),
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                }
              }
            }
          );
        }else{
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("OPEN")
              }
            }
          );
        }
        
      }

      if (dataBody.value.category === "SR"){
        if (dataBody.value.limit_finish_weight > 0){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                }
              }
            }
          );
        }else{
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID")
              }
            }
          );
        }
        
      }

      // pipeLineAggregate.push({ "$sort": { input_date: -1 } });
      stsPage = true;
      break;
    case "dashboard-admin":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
     
      pipeLineAggregate.push({ "$sort": { input_date: -1 } });
      stsPage = true;
      break;
    case "item_name":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      stsPage = true;
      break;
    case "sample_type_name":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
      
      stsPage = true;
      break;
    default:
      return [400, "Status filter not found!"]
  }
  
  if (dataBody.filter === "sample_type_name"){
    pipeLineAggregate.push(
      { "$lookup": { from: 'tm_sample_type', localField: 'sample_type_code', foreignField: 'sample_type_code', as: 'item'}},
      { "$unwind": "$item"}
    );

    pipeLineAggregate.push({ 
      "$match": { 
        "item.sample_type_name": new RegExp(encryptText(dataBody.value.sample_type_name))
      }
    });
  }else if (dataBody.filter === "item_name"){
    pipeLineAggregate.push(
      { "$lookup": { from: 'tm_sample_type', localField: 'sample_type_code', foreignField: 'sample_type_code', as: 'item'}},
      { "$unwind": "$item"}
    );

    pipeLineAggregate.push({ 
      "$match": { 
        item_name: new RegExp(encryptText(dataBody.value.item_name))
      }
    });
  }else{
    
  }
  
  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  pipeLineAggregate.push(
    { "$skip": Number(dataBody.value.limit_from) },
    { "$limit": Number(dataBody.value.limit_item) }
  );
  pipeLineAggregate.push({ "$project": fieldsItem })

  item = await Item.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(item[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (item[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], item[0].count_detail[0].count_item]
  }

}

async function getItemAll() {
  let item = await Item.aggregate([
    { '$project': fieldsItem2 }
  ]);

  let resDec = decryptJSON(item);
  return resDec;
}

async function getItemOne(dataParams) {
  // let item = await Item.aggregate([
  //   { "$match": { "code_item": encryptText(dataParams.code_item) }},
  //   { '$project': fieldsItem }
  // ]);

  let item = await Item.aggregate([
    { "$match": { "code_item": encryptText(dataParams.code_item) }},
    { '$project': { 
      "sample_type_code":"$sample_type_code",
      "category_code":"$category_code",
      "category_name":"$category_name"
    } }
  ]);

  let resDec = decryptJSON(item);
  return resDec;
}

async function getItemShowroom(dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;
  let tmpHashtag = "";
  let stsLimit = false;
  let katSearchBrg = "";

  const d = new Date();
  d.setDate(d.getDate() -1);

  switch (dataBody.filter) {
    case "all-admin":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ "$match": { status_show: encryptText("VALID") }});
      stsPage = true;
      stsLimit = true;
      break;
    case "all-mobile":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
      
      pipeLineAggregate.push(
        { 
          "$match": { 
            status_show: encryptText("VALID"),
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        }
      );

      stsPage = true;
      stsLimit = true;
      break;
    case "all-last":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ "$match": { status_show: encryptText("VALID") }});
      pipeLineAggregate.push({ "$sort": { tgl_show: -1 } });
      stsPage = true;
      stsLimit = true;
      break;
    case "all-old":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push(
        { 
          "$match": { 
            status_show: encryptText("VALID"),
            tgl_show: {
              $lt: new Date(d)
            },
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        }
      );

      stsPage = true;
      stsLimit = true;
      break;
    case "all-new":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push(
        { 
          "$match": { 
            status_show: encryptText("VALID"),
            tgl_show: {
              $gte: new Date(d)
            },
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        }
      );

      pipeLineAggregate.push({ "$sort": { tgl_show: -1 } });

      stsPage = true;
      stsLimit = true;
      break;
    case "item_name":

      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ 
        "$match": { 
          status_show: encryptText("VALID"),
          item_name: new RegExp(encryptText(dataBody.value.contents)),
          "$or": [
            { privacy: encryptText("PUBLIC") },
            {selected_customer: encryptText(dataBody.value.kode_customer)},
            {"selected_market": {
              $in: [ encryptText(dataBody.value.negara) ] 
            }}
          ]
        }
      });

      stsPage = true;
      stsLimit = true;
      break;
    case "item_name_admin":
      
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ 
        "$match": { 
          status_show: encryptText("VALID"),
          item_name: new RegExp(encryptText(dataBody.value.item_name))
        }
      });

      stsPage = true;
      stsLimit = true;
      break;
    case "hashtag":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({
        "$match": {
          status_show: encryptText("VALID"),
          "hashtag": {
            $in: [ encryptText(dataBody.value.contents) ] 
          },
          "$or": [
            { privacy: encryptText("PUBLIC") },
            {selected_customer: encryptText(dataBody.value.kode_customer)},
            {"selected_market": {
              $in: [ encryptText(dataBody.value.negara) ] 
            }}
          ]
        }
      });

      stsPage = true;
      stsLimit = true;
      break;
    case "category-mobile":
      
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      if (dataBody.value.category_code == "SHOW ALL") {
        pipeLineAggregate.push({ 
          "$match": { 
            status_show: encryptText("VALID"),
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        });
      }else{
        pipeLineAggregate.push({ 
          "$match": { 
            status_show: encryptText("VALID"),
            sample_type_code: encryptText(dataBody.value.category_code),
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        });
      }
      
      stsPage = true;
      stsLimit = true;
      break;
    case "list-category-mobile":
    
      pipeLineAggregate.push({ 
        "$match": { 
          status_show: encryptText("VALID"),
          "$or": [
            { privacy: encryptText("PUBLIC") },
            {selected_customer: encryptText(dataBody.value.kode_customer)},
            {"selected_market": {
              $in: [ encryptText(dataBody.value.negara) ] 
            }}
          ]
        }
      });
      
      stsPage = true;
      break;
    case "tukaran-mobile":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
      
      if (dataBody.value.limit_finish_weight > 0 && dataBody.value.limit_finish_price > 0){
        katSearchBrg = "ALL";
      }else if (dataBody.value.limit_finish_weight > 0){
        katSearchBrg = "WEIGHT";
      }else if (dataBody.value.limit_finish_price > 0){
        katSearchBrg = "PRICE";
      }else{
        katSearchBrg = "ALL";
      }

      if (dataBody.value.negara === "INDONESIA"){
        // Weight
        if (katSearchBrg === "WEIGHT"){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                },
                "$or": [
                  { privacy: encryptText("PUBLIC") },
                  {selected_customer: encryptText(dataBody.value.kode_customer)},
                  {"selected_market": {
                    $in: [ encryptText(dataBody.value.negara) ] 
                  }}
                ]
              }
            }
          );
        }

        // Price
        if (katSearchBrg === "PRICE"){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.kadar": {
                  $gte: maskedNumber(dataBody.value.limit_start_price),
                  $lte: maskedNumber(dataBody.value.limit_finish_price)
                },
                "$or": [
                  { privacy: encryptText("PUBLIC") },
                  {selected_customer: encryptText(dataBody.value.kode_customer)},
                  {"selected_market": {
                    $in: [ encryptText(dataBody.value.negara) ] 
                  }}
                ]
              }
            }
          );
        }

        // Weight and Price
        if (katSearchBrg === "ALL"){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                },
                "material.kadar": {
                  $gte: maskedNumber(dataBody.value.limit_start_price),
                  $lte: maskedNumber(dataBody.value.limit_finish_price)
                },
                "$or": [
                  { privacy: encryptText("PUBLIC") },
                  {selected_customer: encryptText(dataBody.value.kode_customer)},
                  {"selected_market": {
                    $in: [ encryptText(dataBody.value.negara) ] 
                  }}
                ]
              }
            }
          );
        }

      }else{

        // Luar Negeri

        // Weight
        if (katSearchBrg === "WEIGHT"){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                },
                "$or": [
                  { privacy: encryptText("PUBLIC") },
                  {selected_customer: encryptText(dataBody.value.kode_customer)},
                  {"selected_market": {
                    $in: [ encryptText(dataBody.value.negara) ] 
                  }}
                ]
              }
            }
          );
        }

        // Price
        if (katSearchBrg === "PRICE"){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.price": {
                  $gte: maskedNumber(dataBody.value.limit_start_price),
                  $lte: maskedNumber(dataBody.value.limit_finish_price)
                },
                "$or": [
                  { privacy: encryptText("PUBLIC") },
                  {selected_customer: encryptText(dataBody.value.kode_customer)},
                  {"selected_market": {
                    $in: [ encryptText(dataBody.value.negara) ] 
                  }}
                ]
              }
            }
          );
        }

        // Weight And Price
        if (katSearchBrg === "ALL"){
          pipeLineAggregate.push(
            { 
              "$match": { 
                status_show: encryptText("VALID"),
                "material.total_nett_weight": {
                  $gte: maskedNumber(dataBody.value.limit_start_weight),
                  $lte: maskedNumber(dataBody.value.limit_finish_weight)
                },
                "material.price": {
                  $gte: maskedNumber(dataBody.value.limit_start_price),
                  $lte: maskedNumber(dataBody.value.limit_finish_price)
                },
                "$or": [
                  { privacy: encryptText("PUBLIC") },
                  {selected_customer: encryptText(dataBody.value.kode_customer)},
                  {"selected_market": {
                    $in: [ encryptText(dataBody.value.negara) ] 
                  }}
                ]
              }
            }
          );
        }

      }
      
      stsPage = true;
      stsLimit = true;
      break;
    case "weight-mobile":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
      
      pipeLineAggregate.push(
        { 
          "$match": { 
            status_show: encryptText("VALID"),
            "material.total_nett_weight": {
              $gte: maskedNumber(dataBody.value.limit_start),
              $lte: maskedNumber(dataBody.value.limit_finish)
            },
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        }
      );

      stsPage = true;
      stsLimit = true;
      break;
    case"detail_banner_mobile":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
      
      pipeLineAggregate.push(
        { 
          "$match": { 
            status_show: encryptText("VALID"),
            "deskripsi_banner": {
              $in : [encryptText(dataBody.value.kode_banner)]
            },
            "$or": [
              { privacy: encryptText("PUBLIC") },
              {selected_customer: encryptText(dataBody.value.kode_customer)},
              {"selected_market": {
                $in: [ encryptText(dataBody.value.negara) ] 
              }}
            ]
          }
        }
      );

      stsPage = true;
      stsLimit = true;
      break;
    case"detail_banner_admin":

      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];
      
      pipeLineAggregate.push(
        { 
          "$match": { 
            status_show: encryptText("VALID"),
            "deskripsi_banner": {
              $in : [encryptText(dataBody.value.kode_banner)]
            }
          }
        }
      );

      stsPage = true;
      stsLimit = true;
      break;
    default:
      return [400, "Status filter not found!"]
  }

  pipeLineAggregate.push(
    { "$lookup": { from: 'tm_item', localField: 'code_item', foreignField: 'code_item', as: 'item'}},
    { "$unwind": "$item"}
  );

  if (dataBody.filter =="list-category-mobile") {
    pipeLineAggregate.push({ $group: { _id: "$sample_type_code" } } );
  }
  
  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  if (dataBody.filter != "list-category-mobile") {
    pipeLineAggregate.push(
      { "$skip": Number(dataBody.value.limit_from) },
      { "$limit": Number(dataBody.value.limit_item) }
    );
  }
  
  // Field
  switch (dataBody.filter){
    case "list-category-mobile":
      pipeLineAggregate.push({ "$project": { "sample_type_code":"$sample_type_code" } })
      break;
    default:
      pipeLineAggregate.push({ "$project": fieldsItem })
      break;
  }
  
  item = await Item.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(item[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (item[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], item[0].count_detail[0].count_item]
  }

}

// Get Hashtag
async function getShowroomHashtag() {
  
  let item = await Item.aggregate([
    { 
      "$match": { 
        status_show: encryptText("VALID")
      }
    },
    {'$project':{
      "hashtag":["$hashtag"]
    }}
  ]);

  let resDec = decryptJSON(item);
  return resDec;
}

// Get Hashtag
async function getListHashtag(dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;

  // return [400,dataBody]
  switch (dataBody.filter) {
    case "all":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ "$match": { hashtag: new RegExp(encryptText(dataBody.value.hashtag)) }});
      pipeLineAggregate.push({ "$sort": { hashtag: -1 } });
      stsPage = true;
      break;
    default:
      return [400, "Status filter not found!"]
  }

  pipeLineAggregate.push(
    { "$lookup": { from: 'tm_hashtag', localField: 'hashtag', foreignField: 'hashtag', as: 'item'}},
    { "$unwind": "$item"}
  );
  
  let pipeLineAggregateCount = [];
  
  for (let x in pipeLineAggregate) {
    pipeLineAggregateCount.push(pipeLineAggregate[x]);
  }

  pipeLineAggregateCount.push({ "$count": "count_item" });

  pipeLineAggregate.push(
    { "$skip": Number(dataBody.value.limit_from) },
    { "$limit": Number(dataBody.value.limit_item) }
  );
  pipeLineAggregate.push({ "$project": fieldsHashtag })

  hashtag = await Hashtag.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(hashtag[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (hashtag[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], hashtag[0].count_detail[0].count_item]
  }
  // ========================================================
  // let hashtag = await Hashtag.aggregate([
  //   { "$match": { "hashtag": new RegExp(encryptText(tmpHashtag)) }},
  //   { '$project': fieldsHashtag }
  // ]);

  // let resDec = decryptJSON(hashtag);
  // return resDec;
}

async function getDetailShowroom(dataUser, dataParams) {
  let item = await Item.aggregate([
    { "$match": { "status_show": encryptText("VALID"),code_item: encryptText(dataParams.code_item) }},
    { '$project': fieldsItem }
  ]);

  let resDec = decryptJSON(item);
  return resDec;
}

async function getDetailDeskripsiShowroom(dataUser, dataParams) {
  let item = await Item.aggregate([
    { "$match": { "status_show": encryptText("VALID"),code_item: encryptText(dataParams.code_item) }},
    { '$project': fieldsItem }
  ]);

  let resDec = decryptJSON(item);
  return resDec;
}

async function getWeightShowroom(dataBody) {
  tmpNettWeight = 0;
  tmpKadar = 0;
  tmpPrice = 0;
  tmpStatusBrg = "";

  let item01 = await Item.findOne({ 
    code_item:encryptText(dataBody.value.code_item),
    status_show: encryptText("VALID")
   });
  if (!item01) return [400,`Item not found!`];
  
  for (let i in item01.material){
    if (item01.material[i].metal_title_code === encryptText(dataBody.value.metal_title_code)){
      tmpStatusBrg = "VALID";
      tmpNettWeight = unMaskedNumber(item01.material[i].total_nett_weight);
      tmpKadar = unMaskedNumber(item01.material[i].kadar);
      tmpPrice = unMaskedNumber(item01.material[i].price);
      break;
    }
    tmpStatusBrg = "NOT VALID";
  }

  if (tmpStatusBrg === "NOT VALID"){
    return [400,`Metal title code not found`]
  }

  const resultGet = ({
    "total_net_weight": tmpNettWeight,
    "kadar":tmpKadar,
    "price":tmpPrice
  });

  return [200,resultGet];
}

async function addShowroom(session, dataUser, dataBody) {
  var i;

  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];
  
  for (i in encBody){
    let item = await Item.findOneAndUpdate(
      { 
        code_item: encBody[i].code_item,
        status_show: encryptText("OPEN")
      },
      {
        status_show: encryptText("VALID"),
        status_active: encryptText("VALID"),
        tgl_show: dateNow(),
        active_date:dateNow()
    },{ session: session });
    if (!item) return [404, `Data Item : ${decryptText(encBody[i].code_item)} tidak di temukan!`];
  }

  return [200, "Item berhasil masuk ke showroom!"];
}

async function deleteShowroom(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  for (i in encBody){
    let item = await Item.findOneAndUpdate(
      { 
        code_item: encBody[i].code_item,
        status_show: encryptText("VALID")
      },
      {
        status_show: encryptText("OPEN"),
        status_active: encryptText("OPEN")
    },{ session: session });
    if (!item) return [404, `Data Item tidak di temukan!`];
  }

  return [200, "Item berhasil dihapus di showroom!"];
}

exports.addItem = addItem;
exports.editItem = editItem;
exports.deleteItem = deleteItem;
exports.getItem = getItem;
exports.getItemAll = getItemAll;
exports.getItemOne = getItemOne;
exports.getItemShowroom = getItemShowroom;
exports.getDetailShowroom = getDetailShowroom;
exports.getDetailDeskripsiShowroom = getDetailDeskripsiShowroom;
exports.getWeightShowroom = getWeightShowroom;
exports.getShowroomHashtag = getShowroomHashtag;
exports.getListHashtag = getListHashtag;
exports.addShowroom = addShowroom;
exports.deleteShowroom = deleteShowroom;
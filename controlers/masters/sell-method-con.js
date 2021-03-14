const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  encryptJSON, 
  encryptText, 
  decryptText, 
  decryptJSON
} = require('../../middleware/encrypt');
const { dateNow, convertDate } = require('../../middleware/convertdate');

const { 
  SellMethod, 
  fieldsSellMethod
} = require('../../models/masters/sell-method-mdl');


async function addSellMethod(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sellMethod = await SellMethod.findOne({ sell_method_code:encBody.sell_method_code });
  if (sellMethod) return [400,`Sell Method sudah terdaftar!`];

  sellMethod = new SellMethod({
    "sell_method_code": encBody.sell_method_code,
    "sell_method_name": encBody.sell_method_name,
    "item_code": encBody.item_code
  });
  
  await sellMethod.save({ session: session });
  
  return [200, "Data Sell Method berhasil di simpan!"]; 
}

async function editSellMethod(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sellMethod = await SellMethod.findOneAndUpdate({ sell_method_code: encryptText(dataParams.sell_method_code) },
    {
      sell_method_name: encBody.sell_method_name,
      item_code: encBody.item_code
  },{ session: session });
  if (!sellMethod) return [404, `Data Sell Method tidak di temukan!`];

  return [200, "Edit data Sell Method berhasil!"];
}

async function deleteSellMethod(session, dataUser, dataParams) {
  const sellMethod = await SellMethod.findOneAndRemove({
    sell_method_code: encryptText(dataParams.sell_method_code)
  }, { session: session });
  if (!sellMethod) return [404, `Data Sell Method tidak di temukan!`];
  
  return [200, "Delete data Sell Method berhasil!"];
}

async function getSellMethod() {
  let sellMethod = await SellMethod.aggregate([
    { '$project': fieldsSellMethod }
  ]);

  let resDec = decryptJSON(sellMethod);
  return resDec;
}

exports.addSellMethod = addSellMethod;
exports.editSellMethod = editSellMethod;
exports.deleteSellMethod = deleteSellMethod;
exports.getSellMethod = getSellMethod;
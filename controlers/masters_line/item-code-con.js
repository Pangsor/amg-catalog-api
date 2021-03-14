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
  ItemCode,
  fieldsItemCode
} = require('../../models/masters_line/item-code-mdl');

async function addItemCode(session, dataUser, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if (resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let arrCode = [];
  for (let c in encBody){
    let itemCode = await ItemCode.findOne({ code_item: encBody[c].code_item });
    if (itemCode) return [400,`Item ${decryptText(encBody[c].code_item)} sudah terdaftar!`];

    arrCode.push({
      code_item: encBody[c].code_item,
      item_name: encBody[c].item_name,
      status:encryptText("OPEN")
    });
  };

  await ItemCode.insertMany(arrCode);
  
  return [200, "Data Item Code berhasil di simpan!"]; 
}

async function editItemCode(session, dataUser, dataParams, dataBody) {
  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let itemCode = await ItemCode.findOneAndUpdate({ code_item: encryptText(dataParams.code_item) },
    {
      item_name: encBody.item_name
  },{ session: session });
  if (!itemCode) return [404, `Data Item Code tidak di temukan!`];

  return [200, "Edit data Item Code berhasil!"];
}

async function deleteItemCode(session, dataUser, dataParams) {
  const itemCode = await ItemCode.findOneAndRemove({
    code_item: encryptText(dataParams.code_item)
  }, { session: session });
  if (!itemCode) return [404, `Data Item Code tidak di temukan!`];
  
  return [200, "Delete data Item Code berhasil!"];
}

async function getItemCodeAll2() {
  let itemCode = await ItemCode.aggregate([
    { '$project': fieldsItemCode }
  ]);

  let resDec = decryptJSON(itemCode);
  return resDec;
}

async function getItemCodeAll(dataBody) {
  let pipeLineAggregate = [];
  let stsPage = false;
  
  switch (dataBody.filter) {
    case "all-open":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ "$match": { status: encryptText("OPEN") }});
      stsPage = true;
      break;
    case "all-close":
      if (Number(dataBody.value.limit_from).toString() === "NaN") return [400, "Limit From harus di isi dengan angka!"];
      if (Number(dataBody.value.limit_item).toString() === "NaN") return [400, "Limit item harus di isi dengan angka!"];

      pipeLineAggregate.push({ "$match": { status: encryptText("CLOSE") }});
      stsPage = true;
      break;
    default:
      return [400, "Status filter not found!"]
  }
  
  pipeLineAggregate.push(
    { "$lookup": { from: 'tm_code_item', localField: 'code_item', foreignField: 'code_item', as: 'item'}},
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
  pipeLineAggregate.push({ "$project": fieldsItemCode })

  itemCode = await ItemCode.aggregate([
    { "$facet": {
      "count_detail": pipeLineAggregateCount,
      "detail_barang": pipeLineAggregate
    }}
  ]);
  
  resDec = decryptJSON(itemCode[0].detail_barang);
  if (resDec[0] !== 200) return resDec;
  
  if (itemCode[0].count_detail.length == 0) {
    return [200, resDec[1], 0]
  } else {
    return [200, resDec[1], itemCode[0].count_detail[0].count_item]
  }

}

async function getItemCode(dataUser,dataParams) {
  let itemCode = await ItemCode.aggregate([
    { "$match": { code_item: encryptText(dataParams.code_item) }},
    { '$project': fieldsItemCode }
  ]);

  let resDec = decryptJSON(itemCode);
  return resDec;
}

exports.addItemCode = addItemCode;
exports.editItemCode = editItemCode;
exports.deleteItemCode = deleteItemCode;
exports.getItemCodeAll = getItemCodeAll;
exports.getItemCode = getItemCode;
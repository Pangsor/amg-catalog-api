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
  SampleType, 
  fieldsSampleType
} = require('../../models/masters/sample-type-mdl');

const { Item } = require('../../models/masters_line/item-mdl');

async function editSampleType(session, dataBody) {
  let tmpSampleTypeCode = "";

  const resEnc = encryptJSON(dataBody);
  if(resEnc[0] !== 200){
    return resEnc;
  }
  const encBody = resEnc[1];

  let sampleType = await SampleType.findOne({ sample_type_name: encBody.sample_type_name })
  if (!sampleType){
    return [200,"Sample type name not found"];
  }
  tmpSampleTypeCode = sampleType.sample_type_code;

  let resUpdate = await Item.updateMany({ sample_type_code: encBody.sample_type_name },
    {
      sample_type_code: tmpSampleTypeCode
  },{ session: session });
  if (!resUpdate) return [404, `Sample Type Code tidak di temukan!`];

  return [200, "Edit data Sample Type Code berhasil!"];
}

exports.editSampleType = editSampleType;

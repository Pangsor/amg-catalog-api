const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  id_kota: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  nama_area: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const Area = mongoose.model('tm_area', areaSchema, 'tm_area');

const fieldsArea = {
  "id_kota":"$id_kota",
  "nama_area":"$nama_area"
}

function validateAreaAdd(data) {
  const schema = Joi.object({
    id_kota: Joi.string().min(1).max(60).required(),
    nama_area: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateAreaEdit(data) {
  const schema = Joi.object({
    nama_area: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.Area = Area; 

exports.fieldsArea = fieldsArea;
exports.validateAreaAdd = validateAreaAdd;
exports.validateAreaEdit = validateAreaEdit;
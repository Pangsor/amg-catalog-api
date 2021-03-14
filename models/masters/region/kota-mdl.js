const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const kotaSchema = new mongoose.Schema({
  id_provinsi: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  nama_kota: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const Kota = mongoose.model('tm_kota', kotaSchema, 'tm_kota');

const fieldsKota = {
  "id_provinsi":"$id_provinsi",
  "nama_kota":"$nama_kota"
}

function validateKotaAdd(data) {
  const schema = Joi.object({
    id_provinsi: Joi.string().min(1).max(60).required(),
    nama_kota: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateKotaEdit(data) {
  const schema = Joi.object({
    nama_kota: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.Kota = Kota; 

exports.fieldsKota = fieldsKota;
exports.validateKotaAdd = validateKotaAdd;
exports.validateKotaEdit = validateKotaEdit;
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const provinsiSchema = new mongoose.Schema({
  id_negara: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  nama_provinsi: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const Provinsi = mongoose.model('tm_provinsi', provinsiSchema, 'tm_provinsi');

const fieldsProvinsi = {
  "id_negara":"$id_negara",
  "nama_provinsi":"$nama_provinsi"
}

function validateProvinsiAdd(data) {
  const schema = Joi.object({
    id_negara: Joi.string().min(1).max(60).required(),
    nama_provinsi: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateProvinsiEdit(data) {
  const schema = Joi.object({
    nama_provinsi: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.Provinsi = Provinsi; 

exports.fieldsProvinsi = fieldsProvinsi;
exports.validateProvinsiAdd = validateProvinsiAdd;
exports.validateProvinsiEdit = validateProvinsiEdit;
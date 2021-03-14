const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const systemPerusahaanSchema = new mongoose.Schema({
  kode_perusahaan: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 40,
    unique: true
  },
  nama_perusahaan: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 80
  },
  email: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  no_hp: {
    type: String,
    required: true, 
    uppercase: true,
    minlength: 1, 
    maxlength: 40
  },
  logo: {
    type: String,
    required: true, 
    minlength: 1
  },
  alamat: {
    type: String,
    required: true, 
    uppercase: true,
    minlength: 1, 
    maxlength: 150
  },
  lokasi: {
    type: String,
    required: true, 
    uppercase: true
  },
  input_by: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80
  },
  input_date: {
    type: Date,
    default: Date.now
  },
  edit_by: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80
  },
  edit_date: {
    type: Date,
    default: Date.now
  }
});

const SystemPerusahaan = mongoose.model('tp_system', systemPerusahaanSchema, 'tp_system');

const fieldsPerusahaan = {
  "kode_perusahaan": "$kode_perusahaan",
  "nama_perusahaan": "$nama_perusahaan",
  "email": "$email",
  "no_hp": "$no_hp",
  "logo": "$logo",
  "alamat": "$alamat",
  "lokasi": "$lokasi"
}

function validateSystemAdd(system) {
  const schema = Joi.object({
    kode_perusahaan: Joi.string().min(1).max(50).required(),
    nama_perusahaan: Joi.string().min(1).max(80).required(),
    email: Joi.string().email().max(80).required(),
    no_hp: Joi.string().min(1).max(50).required(),
    logo: Joi.string().required(),
    alamat: Joi.string().min(1).max(150).required(),
    lokasi: Joi.string().required(),
    input_by: Joi.string().min(1).max(50).required()
  });

  return schema.validate(system); 
}

exports.SystemPerusahaan = SystemPerusahaan; 

exports.validateSystemAdd = validateSystemAdd;

exports.fieldsPerusahaan = fieldsPerusahaan;
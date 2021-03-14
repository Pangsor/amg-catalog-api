const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const negaraSchema = new mongoose.Schema({
  nama_negara: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const Negara = mongoose.model('tm_negara', negaraSchema, 'tm_negara');

const fieldsNegara = {
  "nama_negara":"$nama_negara"
}

function validateNegaraAdd(data) {
  const schema = Joi.object({
    nama_negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateNegaraEdit(data) {
  const schema = Joi.object({
    nama_negara: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.Negara = Negara; 

exports.fieldsNegara = fieldsNegara;
exports.validateNegaraAdd = validateNegaraAdd;
exports.validateNegaraEdit = validateNegaraEdit;
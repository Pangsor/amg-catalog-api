const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const sampleQuantityTypeSchema = new mongoose.Schema({
  qty_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  qty_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  }
});

const SampleQuantityType = mongoose.model('tm_sample_qty_set', sampleQuantityTypeSchema, 'tm_sample_qty_set');

const fieldsSampleQuantityType = {
  "qty_code":"$qty_code",
  "qty_name":"$qty_name"
}

function validateSampleQuantityTypeAdd(data) {
  const schema = Joi.object({
    qty_code: Joi.string().min(1).max(30).required(),
    qty_name: Joi.string().min(1).max(40).required()
  }).required();

  return schema.validate(data); 
}

function validateSampleQuantityTypeEdit(data) {
  const schema = Joi.object({
    qty_name: Joi.string().min(1).max(40).required()
  }).required();

  return schema.validate(data); 
}

exports.SampleQuantityType = SampleQuantityType; 

exports.fieldsSampleQuantityType = fieldsSampleQuantityType;
exports.validateSampleQuantityTypeAdd = validateSampleQuantityTypeAdd;
exports.validateSampleQuantityTypeEdit = validateSampleQuantityTypeEdit;
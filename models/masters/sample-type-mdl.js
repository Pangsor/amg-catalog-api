const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const sampleTypeSchema = new mongoose.Schema({
  sample_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 20,
    unique: true
  },
  sample_type_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  item_code: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const SampleType = mongoose.model('tm_sample_type', sampleTypeSchema, 'tm_sample_type');

const fieldsSampleType = {
  "sample_type_code":"$sample_type_code",
  "sample_type_name":"$sample_type_name",
  "item_code":"$item_code"
}

function validateSampleTypeAdd(data) {
  const schema = Joi.object({
    sample_type_code: Joi.string().min(1).max(20).required(),
    sample_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateSampleTypeEdit(data) {
  const schema = Joi.object({
    sample_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.SampleType = SampleType; 

exports.fieldsSampleType = fieldsSampleType;
exports.validateSampleTypeAdd = validateSampleTypeAdd;
exports.validateSampleTypeEdit = validateSampleTypeEdit;
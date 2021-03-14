const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const sampleCategorySchema = new mongoose.Schema({
  category_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 20,
    unique: true
  },
  category_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const SampleCategory = mongoose.model('tm_sample_category', sampleCategorySchema, 'tm_sample_category');

const fieldsSampleCategory = {
  "category_code":"$category_code",
  "category_name":"$category_name"
}

function validateSampleCategoryAdd(data) {
  const schema = Joi.object({
    category_code: Joi.string().min(1).max(20).required(),
    category_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateSampleCategoryEdit(data) {
  const schema = Joi.object({
    category_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.SampleCategory = SampleCategory; 

exports.fieldsSampleCategory = fieldsSampleCategory;
exports.validateSampleCategoryAdd = validateSampleCategoryAdd;
exports.validateSampleCategoryEdit = validateSampleCategoryEdit;
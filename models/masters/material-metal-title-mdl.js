const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const materialMetalTitleSchema = new mongoose.Schema({
  metal_title_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  metal_title_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  quote_data_price_code: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  input_by: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  input_date: {
    type: Date, default: Date.now()
  },
  edit_by: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  edit_date: {
    type: Date, default: Date.now()
  }
});

const MaterialMetalTitle = mongoose.model('tm_metal_title', materialMetalTitleSchema, 'tm_metal_title');

const fieldsMaterialMetalTitle = {
  "metal_title_code":"$metal_title_code",
  "metal_title_name":"$metal_title_name",
  "quote_data_price_code":"$quote_data_price_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateMaterialMetalTitleAdd(data) {
  const schema = Joi.object({
    metal_title_code: Joi.string().min(1).max(30).required(),
    metal_title_name: Joi.string().min(1).max(60).required(),
    quote_data_price_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateMaterialMetalTitleEdit(data) {
  const schema = Joi.object({
    metal_title_name: Joi.string().min(1).max(60).required(),
    quote_data_price_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.MaterialMetalTitle = MaterialMetalTitle; 

exports.fieldsMaterialMetalTitle = fieldsMaterialMetalTitle;
exports.validateMaterialMetalTitleAdd = validateMaterialMetalTitleAdd;
exports.validateMaterialMetalTitleEdit = validateMaterialMetalTitleEdit;
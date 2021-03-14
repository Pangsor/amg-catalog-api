const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const materialTypeSchema = new mongoose.Schema({
  material_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  material_type_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  item_code: {
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

const MaterialType = mongoose.model('tm_material_type', materialTypeSchema, 'tm_material_type');

const fieldsMaterialType = {
  "material_type_code":"$material_type_code",
  "material_type_name":"$material_type_name",
  "item_code":"$item_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateMaterialTypeAdd(data) {
  const schema = Joi.object({
    material_type_code: Joi.string().min(1).max(40).required(),
    material_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateMaterialTypeEdit(data) {
  const schema = Joi.object({
    material_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.MaterialType = MaterialType; 

exports.fieldsMaterialType = fieldsMaterialType;
exports.validateMaterialTypeAdd = validateMaterialTypeAdd;
exports.validateMaterialTypeEdit = validateMaterialTypeEdit;
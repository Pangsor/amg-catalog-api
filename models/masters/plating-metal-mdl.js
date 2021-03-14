const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const platingMetalSchema = new mongoose.Schema({
  plating_metal_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  plating_metal_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
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

const PlatingMetal = mongoose.model('tm_plating_metal', platingMetalSchema, 'tm_plating_metal');

const fieldsPlatingMetal = {
  "plating_metal_code":"$plating_metal_code",
  "plating_metal_name":"$plating_metal_name",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validatePlatingMetalAdd(data) {
  const schema = Joi.object({
    plating_metal_code: Joi.string().min(1).max(30).required(),
    plating_metal_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validatePlatingMetalEdit(data) {
  const schema = Joi.object({
    plating_metal_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.PlatingMetal = PlatingMetal; 

exports.fieldsPlatingMetal = fieldsPlatingMetal;
exports.validatePlatingMetalAdd = validatePlatingMetalAdd;
exports.validatePlatingMetalEdit = validatePlatingMetalEdit;
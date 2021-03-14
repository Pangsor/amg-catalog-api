const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const metalColourSchema = new mongoose.Schema({
  colour_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  colour_type_name: {
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

const MetalColour = mongoose.model('tm_metal_colour_type', metalColourSchema, 'tm_metal_colour_type');

const fieldsMetalColour = {
  "colour_type_code":"$colour_type_code",
  "colour_type_name":"$colour_type_name",
  "item_code":"$item_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateMetalColourAdd(data) {
  const schema = Joi.object({
    colour_type_code: Joi.string().min(1).max(20).required(),
    colour_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateMetalColourEdit(data) {
  const schema = Joi.object({
    colour_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.MetalColour = MetalColour; 

exports.fieldsMetalColour = fieldsMetalColour;
exports.validateMetalColourAdd = validateMetalColourAdd;
exports.validateMetalColourEdit = validateMetalColourEdit;
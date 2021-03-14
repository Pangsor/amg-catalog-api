const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const platingMethodSchema = new mongoose.Schema({
  plating_method_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  plating_method_name: {
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

const PlatingMethod = mongoose.model('tm_plating_method', platingMethodSchema, 'tm_plating_method');

const fieldsPlatingMethod = {
  "plating_method_code":"$plating_method_code",
  "plating_method_name":"$plating_method_name",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validatePlatingMethodAdd(data) {
  const schema = Joi.object({
    plating_method_code: Joi.string().min(1).max(30).required(),
    plating_method_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validatePlatingMethodEdit(data) {
  const schema = Joi.object({
    plating_method_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.PlatingMethod = PlatingMethod; 

exports.fieldsPlatingMethod = fieldsPlatingMethod;
exports.validatePlatingMethodAdd = validatePlatingMethodAdd;
exports.validatePlatingMethodEdit = validatePlatingMethodEdit;
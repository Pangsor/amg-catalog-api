const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const finishTypeSchema = new mongoose.Schema({
  finish_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  finish_type_name: {
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

const FinishType = mongoose.model('tm_finish_type', finishTypeSchema, 'tm_finish_type');

const fieldsFinishType = {
  "finish_type_code":"$finish_type_code",
  "finish_type_name":"$finish_type_name",
  "item_code":"$item_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateFinishTypeAdd(data) {
  const schema = Joi.object({
    finish_type_code: Joi.string().min(1).max(20).required(),
    finish_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateFinishTypeEdit(data) {
  const schema = Joi.object({
    finish_type_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.FinishType = FinishType; 

exports.fieldsFinishType = fieldsFinishType;
exports.validateFinishTypeAdd = validateFinishTypeAdd;
exports.validateFinishTypeEdit = validateFinishTypeEdit;
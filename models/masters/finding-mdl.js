const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const findingSchema = new mongoose.Schema({
  specify_finding_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  specify_finding_name: {
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

const Finding = mongoose.model('tm_specify_findings', findingSchema, 'tm_specify_findings');

const fieldsFinding = {
  "specify_finding_code":"$specify_finding_code",
  "specify_finding_name":"$specify_finding_name",
  "item_code":"$item_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateFindingAdd(data) {
  const schema = Joi.object({
    specify_finding_code: Joi.string().min(1).max(100).required(),
    specify_finding_name: Joi.string().min(1).max(100).required(),
    item_code: Joi.string().min(1).max(50).required()
  }).required();

  return schema.validate(data); 
}

function validateFindingEdit(data) {
  const schema = Joi.object({
    specify_finding_name: Joi.string().min(1).max(100).required(),
    item_code: Joi.string().min(1).max(50).required()
  }).required();

  return schema.validate(data); 
}

exports.Finding = Finding; 

exports.fieldsFinding = fieldsFinding;
exports.validateFindingAdd = validateFindingAdd;
exports.validateFindingEdit = validateFindingEdit;
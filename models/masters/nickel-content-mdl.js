const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const nickelContentSchema = new mongoose.Schema({
  nickel_content_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  nickel_content_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  colour_type_code: {
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

const NickelContent = mongoose.model('tm_nickel_content', nickelContentSchema, 'tm_nickel_content');

const fieldsNickelContent = {
  "nickel_content_code":"$nickel_content_code",
  "nickel_content_name":"$nickel_content_name",
  "colour_type_code":"$colour_type_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateNickelContentAdd(data) {
  const schema = Joi.object({
    nickel_content_code: Joi.string().min(1).max(20).required(),
    nickel_content_name: Joi.string().min(1).max(255).required(),
    colour_type_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateNickelContentEdit(data) {
  const schema = Joi.object({
    nickel_content_name: Joi.string().min(1).max(255).required(),
    colour_type_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.NickelContent = NickelContent; 

exports.fieldsNickelContent = fieldsNickelContent;
exports.validateNickelContentAdd = validateNickelContentAdd;
exports.validateNickelContentEdit = validateNickelContentEdit;
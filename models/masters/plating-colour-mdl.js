const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const platingColourSchema = new mongoose.Schema({
  plating_colour_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  plating_colour_name: {
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

const PlatingColour = mongoose.model('tm_plating_colour', platingColourSchema, 'tm_plating_colour');

const fieldsPlatingColour = {
  "plating_colour_code":"$plating_colour_code",
  "plating_colour_name":"$plating_colour_name",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validatePlatingColourAdd(data) {
  const schema = Joi.object({
    plating_colour_code: Joi.string().min(1).max(30).required(),
    plating_colour_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validatePlatingColourEdit(data) {
  const schema = Joi.object({
    plating_colour_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.PlatingColour = PlatingColour; 

exports.fieldsPlatingColour = fieldsPlatingColour;
exports.validatePlatingColourAdd = validatePlatingColourAdd;
exports.validatePlatingColourEdit = validatePlatingColourEdit;
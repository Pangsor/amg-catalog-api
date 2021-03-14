const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneColourSchema = new mongoose.Schema({
  stone_colour_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  stone_colour_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_code: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const StoneColour = mongoose.model('tm_stone_colour', stoneColourSchema, 'tm_stone_colour');

const fieldsStoneColour = {
  "stone_colour_code":"$stone_colour_code",
  "stone_colour_name":"$stone_colour_name",
  "stone_code":"$stone_code"
}

function validateStoneColourAdd(data) {
  const schema = Joi.object({
    stone_colour_code: Joi.string().min(1).max(30).required(),
    stone_colour_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneColourEdit(data) {
  const schema = Joi.object({
    stone_colour_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneColour = StoneColour; 

exports.fieldsStoneColour = fieldsStoneColour;
exports.validateStoneColourAdd = validateStoneColourAdd;
exports.validateStoneColourEdit = validateStoneColourEdit;
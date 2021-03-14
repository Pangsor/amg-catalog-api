const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneTypeSchema = new mongoose.Schema({
  stone_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  stone_type_name: {
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

const StoneType = mongoose.model('tm_stone_type', stoneTypeSchema, 'tm_stone_type');

const fieldsStoneType = {
  "stone_type_code":"$stone_type_code",
  "stone_type_name":"$stone_type_name",
  "stone_code":"$stone_code"
}

function validateStoneTypeAdd(data) {
  const schema = Joi.object({
    stone_type_code: Joi.string().min(1).max(30).required(),
    stone_type_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneTypeEdit(data) {
  const schema = Joi.object({
    stone_type_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneType = StoneType; 

exports.fieldsStoneType = fieldsStoneType;
exports.validateStoneTypeAdd = validateStoneTypeAdd;
exports.validateStoneTypeEdit = validateStoneTypeEdit;
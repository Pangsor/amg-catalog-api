const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneOriginSchema = new mongoose.Schema({
  stone_origin_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  stone_origin_name: {
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

const StoneOrigin = mongoose.model('tm_stone_origin', stoneOriginSchema, 'tm_stone_origin');

const fieldsStoneOrigin = {
  "stone_origin_code":"$stone_origin_code",
  "stone_origin_name":"$stone_origin_name",
  "stone_code":"$stone_code"
}

function validateStoneOriginAdd(data) {
  const schema = Joi.object({
    stone_origin_code: Joi.string().min(1).max(30).required(),
    stone_origin_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneOriginEdit(data) {
  const schema = Joi.object({
    stone_origin_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneOrigin = StoneOrigin; 

exports.fieldsStoneOrigin = fieldsStoneOrigin;
exports.validateStoneOriginAdd = validateStoneOriginAdd;
exports.validateStoneOriginEdit = validateStoneOriginEdit;
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneCutSchema = new mongoose.Schema({
  cut_stone_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  cut_stone_name: {
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

const StoneCut = mongoose.model('tm_stone_cut', stoneCutSchema, 'tm_stone_cut');

const fieldsStoneCut = {
  "cut_stone_code":"$cut_stone_code",
  "cut_stone_name":"$cut_stone_name",
  "stone_code":"$stone_code"
}

function validateStoneCutAdd(data) {
  const schema = Joi.object({
    cut_stone_code: Joi.string().min(1).max(30).required(),
    cut_stone_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneCutEdit(data) {
  const schema = Joi.object({
    cut_stone_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneCut = StoneCut; 

exports.fieldsStoneCut = fieldsStoneCut;
exports.validateStoneCutAdd = validateStoneCutAdd;
exports.validateStoneCutEdit = validateStoneCutEdit;
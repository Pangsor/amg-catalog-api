const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneCategorySchema = new mongoose.Schema({
  stone_category_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  stone_category_name: {
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

const StoneCategory = mongoose.model('tm_stone_category', stoneCategorySchema, 'tm_stone_category');

const fieldsStoneCategory = {
  "stone_category_code":"$stone_category_code",
  "stone_category_name":"$stone_category_name",
  "stone_code":"$stone_code"
}

function validateStoneCategoryAdd(data) {
  const schema = Joi.object({
    stone_category_code: Joi.string().min(1).max(30).required(),
    stone_category_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneCategoryEdit(data) {
  const schema = Joi.object({
    stone_category_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneCategory = StoneCategory; 

exports.fieldsStoneCategory = fieldsStoneCategory;
exports.validateStoneCategoryAdd = validateStoneCategoryAdd;
exports.validateStoneCategoryEdit = validateStoneCategoryEdit;
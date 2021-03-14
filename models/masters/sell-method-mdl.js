const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const sellMethodSchema = new mongoose.Schema({
  sell_method_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 20,
    unique: true
  },
  sell_method_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  item_code: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const SellMethod = mongoose.model('tm_sell_method', sellMethodSchema, 'tm_sell_method');

const fieldsSellMethod = {
  "sell_method_code":"$sell_method_code",
  "sell_method_name":"$sell_method_name",
  "item_code":"$item_code"
}

function validateSellMethodAdd(data) {
  const schema = Joi.object({
    sell_method_code: Joi.string().min(1).max(20).required(),
    sell_method_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateSellMethodEdit(data) {
  const schema = Joi.object({
    sell_method_name: Joi.string().min(1).max(60).required(),
    item_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.SellMethod = SellMethod; 

exports.fieldsSellMethod = fieldsSellMethod;
exports.validateSellMethodAdd = validateSellMethodAdd;
exports.validateSellMethodEdit = validateSellMethodEdit;
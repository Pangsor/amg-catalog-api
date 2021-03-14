const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const itemCodeSchema = new mongoose.Schema({
  code_item: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 200,
    unique: true
  },
  item_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  status: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 50
  }
});

const ItemCode = mongoose.model('tm_code_item', itemCodeSchema, 'tm_code_item');

const fieldsItemCode = {
  "code_item":"$code_item",
  "item_name":"$item_name",
  "status":"$status"
}

function validateItemCodeAdd(data) {
  const code = Joi.object({
    code_item: Joi.string().min(1).max(60).required(),
    item_name: Joi.string().min(1).max(100).required()
  }).required();

  const schema = Joi.object({
    code: Joi.array().items(code).required()
  }).required();

  return schema.validate(data); 
}

function validateItemCodeEdit(data) {
  const schema = Joi.object({
    item_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.ItemCode = ItemCode; 

exports.fieldsItemCode = fieldsItemCode;
exports.validateItemCodeAdd = validateItemCodeAdd;
exports.validateItemCodeEdit = validateItemCodeEdit;
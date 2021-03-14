const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const chainTypeSchema = new mongoose.Schema({
  chain_type_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 200,
    unique: true
  },
  chain_type_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  item_chains_code: {
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

const ChainType = mongoose.model('tm_chains_type', chainTypeSchema, 'tm_chains_type');

const fieldsChainType = {
  "chain_type_code":"$chain_type_code",
  "chain_type_name":"$chain_type_name",
  "item_chains_code":"$item_chains_code",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "edit_by":"$edit_by",
  "edit_date":"$edit_date"
}

function validateChainTypeAdd(data) {
  const schema = Joi.object({
    chain_type_code: Joi.string().min(1).max(20).required(),
    chain_type_name: Joi.string().min(1).max(60).required(),
    item_chains_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateChainTypeEdit(data) {
  const schema = Joi.object({
    chain_type_name: Joi.string().min(1).max(60).required(),
    item_chains_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.ChainType = ChainType; 

exports.fieldsChainType = fieldsChainType;
exports.validateChainTypeAdd = validateChainTypeAdd;
exports.validateChainTypeEdit = validateChainTypeEdit;
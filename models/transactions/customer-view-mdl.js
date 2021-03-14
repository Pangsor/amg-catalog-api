const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { number } = require('@hapi/joi');
const { fieldsCustomerPo2 } = require('./customer-po-mdl');

const itemDetailSchema = new mongoose.Schema({
  code_item: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  total_view: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const custViewSchema = new mongoose.Schema({
  kode_customer: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  total:{
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  itemdetail:[
    itemDetailSchema
  ]
});

const CustomerView = mongoose.model('tt_customer_view', custViewSchema, 'tt_customer_view');

const fieldsCustomerView = {
  "kode_customer":"$kode_customer",
  "itemdetail":"$itemdetail"
}

function validateCustomerViewAdd(data) {
  const schema = Joi.object({
    kode_customer: Joi.string().min(1).max(40).required(),
    code_item: Joi.string().min(1).max(40).required()
  }).required();

  return schema.validate(data); 
}

function validateCustomerViewSearch(data) {
  const schema = Joi.object({
    tgl1: Joi.string().min(1).max(40).required(),
    tgl2: Joi.string().min(1).max(40).required()
  }).required();

  return schema.validate(data); 
}

exports.CustomerView = CustomerView;
exports.fieldsCustomerView = fieldsCustomerView;
exports.validateCustomerViewAdd = validateCustomerViewAdd;
exports.validateCustomerViewSearch = validateCustomerViewSearch;
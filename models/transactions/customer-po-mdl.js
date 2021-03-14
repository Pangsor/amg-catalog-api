const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { number } = require('@hapi/joi');

const itemDetailSchema = new mongoose.Schema({
  code_item: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  item_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  lokasi_gambar: {
    type: String,
    required: true
  },
  metal_title_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  type_kadar: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  kadar: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  price: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  total_nett_weight: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  total_gross_weight: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  qty_po: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  sub_total_kadar: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  sub_total_price: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  notes: {
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
    maxlength: 40
  }
});

const customerPoSchema = new mongoose.Schema({
  kode_customer: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  nama_customer: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  itemdetail: [
    itemDetailSchema
  ],
  total_kadar: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  total_price: {
    type: Number,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  status_po: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  tgl_po: {
    type: Date, default: Date.now()
  },
  no_po: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
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
  }
});

const noPoSchema = new mongoose.Schema({
  no_po: {
    type: String, uppercase: true, required: true, minlength: 1, maxlength: 40
  },
  tgl_po: {
    type: Date, default: Date.now()
  }
});

const NoPo = mongoose.model('tp_po_customer', noPoSchema, 'tp_po_customer');

const CustomerPo = mongoose.model('tt_po_customer', customerPoSchema, 'tt_po_customer');

const fieldsCustomerPo = {
  "kode_customer":"$kode_customer",
  "nama_customer":"$nama_customer",
  "itemdetail":"$itemdetail",
  "total_kadar":"$total_kadar",
  "total_price":"$total_price",
  "notes":"$notes",
  "status_po":"$status_po",
  "tgl_po":"$tgl_po",
  "no_po":"$no_po",
  "input_by":"$input_by",
  "input_date":"$input_date"
}

const fieldsCustomerPo2 = {
  "kode_customer":"$kode_customer",
  "nama_customer":"$nama_customer",
  "status_po":"$status_po",
  "tgl_po":"$tgl_po",
  "no_po":"$no_po"
}

function validateCustomerPoEdit(data) {
  const schema = Joi.object({
    qty_po: Joi.number().required(),
    notes: Joi.string().min(1).max(1024).required()
  }).required();

  return schema.validate(data); 
}

function validateCustomerPoClose(data) {
  const item = Joi.object({
    code_id: Joi.string().min(1).max(40).required(),
    code_item: Joi.string().min(1).max(40).required(),
    status: Joi.string().min(1).max(40).required()
  }).required();

  const schema = Joi.object({
    item: Joi.array().items(item).required()
  }).required();

  return schema.validate(data); 
}

function validatePoSearchTgl(data) {
  const schema = Joi.object({
    tgl1: Joi.string().min(1).max(30).required(),
    tgl2: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validatePoSearchTglOne(data) {
  const schema = Joi.object({
    kode_customer: Joi.string().min(1).max(60).required(),
    tgl: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.NoPo = NoPo;
exports.CustomerPo = CustomerPo; 

exports.fieldsCustomerPo = fieldsCustomerPo;
exports.fieldsCustomerPo2 = fieldsCustomerPo2;
exports.validateCustomerPoEdit = validateCustomerPoEdit;
exports.validateCustomerPoClose = validateCustomerPoClose;
exports.validatePoSearchTgl = validatePoSearchTgl;
exports.validatePoSearchTglOne = validatePoSearchTglOne;
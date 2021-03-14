const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { number } = require('@hapi/joi');

const tmpPoSchema = new mongoose.Schema({
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
    maxlength: 60
  },
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
  notes: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 1024
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

const TmpPo = mongoose.model('tmp_po', tmpPoSchema, 'tmp_po');

const fieldsTmpPo = {
  "kode_customer":"$kode_customer",
  "nama_customer":"$nama_customer",
  "code_item":"$code_item",
  "item_name":"$item_name",
  "lokasi_gambar":"$lokasi_gambar",
  "metal_title_code":"$metal_title_code",
  "type_kadar":"$type_kadar",
  "kadar":"$kadar",
  "price":"$price",
  "total_nett_weight":"$total_nett_weight",
  "total_gross_weight":"$total_gross_weight",
  "qty_po":"$qty_po",
  "sub_total_kadar":"$sub_total_kadar",
  "sub_total_price":"$sub_total_price",
  "total_kadar":"$total_kadar",
  "total_price":"$total_price",
  "notes":"$notes",
  "input_by":"$input_by",
  "input_date":"$input_date"
}

function validateTmpPoAdd(data) {
  const schema = Joi.object({
    kode_customer: Joi.string().min(1).max(40).required(),
    code_item: Joi.string().min(1).max(40).required(),
    metal_title_code: Joi.string().min(1).max(100).required(),
    qty_po: Joi.number().required(),
    notes: Joi.string().min(1).max(1024).required()
  }).required();

  return schema.validate(data); 
}

function validateTmpPoEdit(data) {
  const schema = Joi.object({
    metal_title_code: Joi.string().min(1).max(100).required(),
    qty_po: Joi.number().required(),
    notes: Joi.string().min(1).max(1024).required()
  }).required();

  return schema.validate(data); 
}

exports.TmpPo = TmpPo; 

exports.fieldsTmpPo = fieldsTmpPo;
exports.validateTmpPoAdd = validateTmpPoAdd;
exports.validateTmpPoEdit = validateTmpPoEdit;
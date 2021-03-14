const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userDetail = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  nama_user: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  level: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  }
});

const customerSchema = new mongoose.Schema({
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
  nama_owner: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  negara: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  provinsi: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  kota: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  area: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  alamat: {
    type: String,
    uppercase: true,
    required: true
  },
  user: [ 
    userDetail 
  ],
  kontak: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  status: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  isactive: {
    type: Number,
    uppercase: true,
    required: true
  },
  input_date: {
    type: Date, default: Date.now
  }
});

customerSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ user_id: this.user[0].user_id, level: this.user[0].level, nama_lkp: this.user[0].nama_user }, config.get('jwtPrivateKey'));
  return token;
}

const Customer = mongoose.model('tm_customer', customerSchema, 'tm_customer');

const fieldsCustomer = {
  "kode_customer":"$kode_customer",
  "nama_customer":"$nama_customer",
  "nama_owner":"$nama_owner",
  "negara":"$negara",
  "provinsi":"$provinsi",
  "kota":"$kota",
  "area":"$area",
  "alamat":"$alamat",
  "level":"$level",
  "kontak":"$kontak",
  "status":"$status",
  "isactive":"$isactive",
  "user":"$user"
}

function validateCustomerAdd(data) {
  const schema = Joi.object({
    nama_customer: Joi.string().min(1).max(60).required(),
    nama_owner: Joi.string().min(1).max(60).required(),
    negara: Joi.string().min(1).max(60).required(),
    provinsi: Joi.string().min(1).max(60).required(),
    kota: Joi.string().min(1).max(60).required(),
    area: Joi.string().min(1).max(60).required(),
    alamat: Joi.string().min(1).max(60).required(),
    user_id: Joi.string().min(1).max(40).required(),
    nama_user: Joi.string().min(1).max(60).required(),
    email: Joi.string().min(1).max(60).required(),
    password: Joi.string().min(1).max(255).required(),
    retype_password: Joi.string().min(1).max(255).required(),
    level: Joi.string().min(1).max(40).required(),
    kontak: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateUserAdd(data) {
  const schema = Joi.object({
    user_id: Joi.string().min(1).max(40).required(),
    nama_user: Joi.string().min(1).max(60).required(),
    email: Joi.string().min(1).max(60).required(),
    password: Joi.string().min(1).max(255).required(),
    retype_password: Joi.string().min(1).max(255).required(),
    level: Joi.string().min(1).max(40).required()
  }).required();

  return schema.validate(data); 
}

function validateCustomerEdit(data) {
  const schema = Joi.object({
    nama_user: Joi.string().min(1).max(60).required(),
    alamat: Joi.string().min(1).max(60).required(),
    kontak: Joi.string().min(1).max(60).required(),
    email: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateUserLogin(data) {
  const schema = Joi.object({
    user_id: Joi.string().min(1).max(40).required(),
    password: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateChangePassword(data) {
  const schema = Joi.object({
    // password: Joi.string().min(1).max(255).required(),
    new_password: Joi.string().min(1).max(255).required(),
    // retype_password: Joi.string().min(1).max(255).required()
  }).required();

  return schema.validate(data); 
}

function validateForgetPassword(data) {
  const schema = Joi.object({
    email: Joi.string().min(1).max(255).required()
  }).required();

  return schema.validate(data); 
}

exports.Customer = Customer; 

exports.fieldsCustomer = fieldsCustomer;
exports.validateCustomerAdd = validateCustomerAdd;
exports.validateUserAdd = validateUserAdd;
exports.validateCustomerEdit = validateCustomerEdit;
exports.validateUserLogin = validateUserLogin;
exports.validateChangePassword = validateChangePassword;
exports.validateForgetPassword = validateForgetPassword;
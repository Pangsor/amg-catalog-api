const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 40,
    unique: true
  },
  nama_lkp: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 80
  },
  pass_key: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1024
  },
  type: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  input_by: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80
  },
  input_date: {
    type: Date,
    default: Date.now
  },
  edit_by: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 80
  },
  edit_date: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ user_id: this.user_id, level: this.type, nama_lkp: this.nama_lkp }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('tm_user', userSchema, 'tm_user');

const fieldsUser = {
  "user_id":"$user_id",
  "nama_lkp":"$nama_lkp",
  "type":"$type",
  "input_by":"$input_by",
  "input_date":"$input_date",
  "pass_key":"$pass_key"
}

function validateUserLogin(user) {
  const schema = Joi.object({
    user_id: Joi.string().min(1).max(40).required(),
    password: Joi.string().min(1).max(60).required()
  });

  return schema.validate(user); 
}

function validateUserAdd(user) {
  const schema = Joi.object({
    user_id: Joi.string().min(1).max(50).required(),
    nama_lkp: Joi.string().min(1).max(80).required(),
    type: Joi.string().min(1).max(80).required(),
    password: Joi.string().min(1).max(255).required(),
    retype_password: Joi.string().min(1).max(255).required()
  });

  return schema.validate(user); 
}

function validateUserEdit(user) {
  const schema = Joi.object({
    nama_lkp: Joi.string().min(1).max(80).required(),
    type: Joi.string().min(1).max(40).required(),
  });

  return schema.validate(user); 
}

function validateChangePassword(user) {
  const schema = Joi.object({
    password: Joi.string().min(1).max(255).required(),
    new_password: Joi.string().min(1).max(255).required(),
    retype_password: Joi.string().min(1).max(255).required()
  });

  return schema.validate(user); 
}

exports.User = User; 

exports.validateUserLogin = validateUserLogin;
exports.validateUserAdd = validateUserAdd;
exports.validateUserEdit = validateUserEdit;
exports.validateChangePassword = validateChangePassword;

exports.fieldsUser = fieldsUser;
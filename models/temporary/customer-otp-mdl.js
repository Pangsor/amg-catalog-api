const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const otpCustomerSchema = new mongoose.Schema({
  kode_otp: {
    type: String, required: true, minlength: 1, maxlength: 20
  },
  email: {
    type: String, uppercase: true, required: true, minlength: 1, maxlength: 150
  },
  user_id: {
    type: String, required: true, minlength: 1, maxlength: 40
  },
  token: {
    type: String, required: true
  },
  send_otp: {
    type: String, required: true, minlength: 1, maxlength: 20
  },
  count: {
    type: Number, required: true, minlength: 1, maxlength: 80
  }
});

const OtpCustomer = mongoose.model('tmp_otp_customer', otpCustomerSchema, 'tmp_otp_customer');

const otpCustomerNoHpSchema = new mongoose.Schema({
  kode_customer: {
    type: String, required: true, minlength: 1, maxlength: 80
  },
  kode_otp: {
    type: String, required: true, minlength: 1, maxlength: 20
  },
  no_hp: {
    type: String, required: true, minlength: 1, maxlength: 80
  },
  count: {
    type: Number, required: true, minlength: 1, maxlength: 80
  }
});

const OtpCustomerNoHp = mongoose.model('tmp_otp_customer_hp', otpCustomerNoHpSchema, 'tmp_otp_customer_hp');

function validateVerifikasiOTP(body) {
  const schema = Joi.object({
    kode_otp: Joi.string().min(1).max(40).required()
  }).required();

  return schema.validate(body); 
}

exports.OtpCustomer = OtpCustomer;
exports.OtpCustomerNoHp = OtpCustomerNoHp;

exports.validateVerifikasiOTP = validateVerifikasiOTP;
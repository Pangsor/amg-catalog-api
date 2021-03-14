const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    kode_banner: {
        type: String,
        uppercase: true,
        required: true, 
        minlength: 1, 
        maxlength: 1024,
    },
    deskripsi: {
        type: String,
        uppercase: true,
        required: true, 
        minlength: 1, 
        maxlength: 1024,
    },
    kode_gambar: {
        type: String,
        required: true, 
        uppercase: true
    },
    lokasi_gambar: {
        type: String,
        required: true
    },
    category: {
        type: String,
        uppercase: true,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    hashtag:[],
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

const Banner = mongoose.model('tm_banner', bannerSchema, 'tm_banner');

const fieldsBanner = {
    "kode_banner":"$kode_banner",
    "deskripsi":"$deskripsi",
    "kode_gambar":"$kode_gambar",
    "lokasi_gambar":"$lokasi_gambar",
    "category":"$category",
    "hashtag":["$hashtag"],
    "input_by":"$input_by",
    "input_date":"$input_date",
    "edit_by":"$edit_by",
    "edit_date":"$edit_date"
}

function validateBannerAdd(data) {

    const code = Joi.object({
        code_item: Joi.string().min(1).max(60).required()
    }).required();

    const hashtag = Joi.object({
        hashtag: Joi.string().min(1).max(60).required()
    }).required();

    const schema = Joi.object({
        kode_banner: Joi.string().min(1).max(100).required(),
        deskripsi: Joi.string().min(1).max(100).required(),
        kode_gambar: Joi.string().required(),
        lokasi_gambar: Joi.string().required(),
        category: Joi.string().min(1).max(30).required(),
        detail_code: Joi.array().items(code).required(),
        detail_hashtag: Joi.array().items(hashtag).required()
    }).required();

  return schema.validate(data); 
}

function validateBannerEdit(data) {
  const schema = Joi.object({
    deskripsi: Joi.string().min(1).max(100).required(),
    kode_gambar: Joi.string().required(),
    lokasi_gambar: Joi.string().required(),
    category: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateSearchDetailBanner(data) {
    const schema = Joi.object({
      kode_banner: Joi.string().min(1).max(60).required(),
      limit_from: Joi.number().required(),
      limit_item: Joi.number().required(),
      kode_customer: Joi.string().min(1).max(60).required(),
      negara: Joi.string().min(1).max(60).required()
    }).required();
  
    return schema.validate(data); 
  }

exports.Banner = Banner; 

exports.fieldsBanner = fieldsBanner;
exports.validateBannerAdd = validateBannerAdd;
exports.validateBannerEdit = validateBannerEdit;
exports.validateSearchDetailBanner = validateSearchDetailBanner;
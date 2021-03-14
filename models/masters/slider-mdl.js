const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const sliderSchema = new mongoose.Schema({
  lokasi_gambar: {
    type: String, uppercase: true, required: true, unique: true
  }
});

const Slider = mongoose.model('tm_slider', sliderSchema, 'tm_slider');

const fieldsSlider = {
  "lokasi_gambar": "$lokasi_gambar"
};

function validAddSlider(slide) {
  const schema = Joi.object({
    lokasi_gambar: Joi.string().required()
  }).required();

  return schema.validate(slide); 
};

exports.Slider = Slider;

exports.fieldsSlider = fieldsSlider;

exports.validAddSlider = validAddSlider;
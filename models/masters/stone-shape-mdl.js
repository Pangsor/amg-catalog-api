const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneShapeSchema = new mongoose.Schema({
  stone_shape_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  stone_shape_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  }
});

const StoneShape = mongoose.model('tm_stone_shape', stoneShapeSchema, 'tm_stone_shape');

const fieldsStoneShape = {
  "stone_shape_code":"$stone_shape_code",
  "stone_shape_name":"$stone_shape_name"
}

function validateStoneShapeAdd(data) {
  const schema = Joi.object({
    stone_shape_code: Joi.string().min(1).max(30).required(),
    stone_shape_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneShapeEdit(data) {
  const schema = Joi.object({
    stone_shape_name: Joi.string().min(1).max(60).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneShape = StoneShape; 

exports.fieldsStoneShape = fieldsStoneShape;
exports.validateStoneShapeAdd = validateStoneShapeAdd;
exports.validateStoneShapeEdit = validateStoneShapeEdit;
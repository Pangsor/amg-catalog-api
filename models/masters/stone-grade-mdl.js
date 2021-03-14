const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const stoneGradeSchema = new mongoose.Schema({
  stone_grade_code: {
    type: String,
    required: true, 
    minlength: 1, 
    maxlength: 30,
    unique: true
  },
  stone_grade_name: {
    type: String,
    uppercase: true,
    required: true,
    minlength: 1,
    maxlength: 60
  },
  stone_code: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const StoneGrade = mongoose.model('tm_stone_grade', stoneGradeSchema, 'tm_stone_grade');

const fieldsStoneGrade = {
  "stone_grade_code":"$stone_grade_code",
  "stone_grade_name":"$stone_grade_name",
  "stone_code":"$stone_code"
}

function validateStoneGradeAdd(data) {
  const schema = Joi.object({
    stone_grade_code: Joi.string().min(1).max(30).required(),
    stone_grade_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

function validateStoneGradeEdit(data) {
  const schema = Joi.object({
    stone_grade_name: Joi.string().min(1).max(60).required(),
    stone_code: Joi.string().min(1).max(30).required()
  }).required();

  return schema.validate(data); 
}

exports.StoneGrade = StoneGrade; 

exports.fieldsStoneGrade = fieldsStoneGrade;
exports.validateStoneGradeAdd = validateStoneGradeAdd;
exports.validateStoneGradeEdit = validateStoneGradeEdit;
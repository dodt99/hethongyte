const Joi = require('joi');

const employeeService = require('../../services/employee');
const gender = require('../../../enums/gender');
const { abort } = require('../../../helpers/error');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      code: Joi.string().max(31).required(),
      email: Joi.string().email().required(),
      name: Joi.string().max(127).required(),
      gender: Joi.valid(...gender.getValues()).required(),
      tel: Joi.string().max(20).required(),
      birthday: Joi.date().required(),
      address: Joi.string().max(127).required(),
      note: Joi.string().allow(null),
      aliasName: Joi.string().max(127).allow(null),
      qualification: Joi.string().max(127).allow(null),
      experience: Joi.string().max(127).allow(null),
      fromAt: Joi.date().allow(null),
      toAt: Joi.date().allow(null),
      positionId: Joi.number().integer().min(1).required(),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function addEmployee(req, res) {
  const params = {
    code: req.body.code,
    email: req.body.email,
    name: req.body.name,
    gender: Number(req.body.gender),
    tel: req.body.tel,
    birthday: req.body.birthday,
    address: req.body.address,
    note: req.body.note,
    aliasName: req.body.aliasName,
    qualification: req.body.qualification,
    experience: req.body.experience,
    fromAt: req.body.fromAt,
    toAt: req.body.toAt,
    positionId: req.body.positionId,
  };

  await validation(params);

  await employeeService.addEmployee(params);
  return res.status(201).send();
}

module.exports = addEmployee;

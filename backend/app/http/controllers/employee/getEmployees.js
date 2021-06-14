const Joi = require('joi');

const employeeService = require('../../services/employee');
const gender = require('../../../enums/gender');

const { abort } = require('../../../helpers/error');
const userStatus = require('../../../enums/userStatus');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      limit: Joi.number().integer().min(0).required(),
      offset: Joi.number().integer().min(0).required(),
      keyword: Joi.string().allow(null),
      gender: Joi.number().valid(...gender.getValues()).allow(null),
      status: Joi.number().valid(...userStatus.getValues()).allow(null),
      positionId: Joi.number().integer().min(1).allow(null),
    });

    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function getEmployees(req, res) {
  const params = {
    limit: req.query.limit,
    offset: req.query.offset,
    keyword: req.query.keyword,
    gender: req.query.gender,
    status: req.query.status,
    positionId: req.query.positionId,
  };

  await validation(params);

  const responseData = await employeeService.getEmployees(params);
  return res.status(200).send(responseData);
}

module.exports = getEmployees;

const Joi = require('joi');

const patientService = require('../../services/patient');
const gender = require('../../../enums/gender');

const { abort } = require('../../../helpers/error');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      limit: Joi.number().integer().min(0).required(),
      offset: Joi.number().integer().min(0).required(),
      keyword: Joi.string().allow(null),
      gender: Joi.number().valid(...gender.getValues()).allow(null),
      sortBy: Joi.valid('id', 'name').allow(null),
      sortType: Joi.valid('desc', 'asc').allow(null),
    });

    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function getPatients(req, res) {
  const params = {
    limit: req.query.limit,
    offset: req.query.offset,
    keyword: req.query.keyword,
    gender: req.query.gender,
    sortBy: req.query.sortBy,
    sortType: req.query.sortType,
  };

  await validation(params);

  const responseData = await patientService.getPatients(params);
  return res.status(200).send(responseData);
}

module.exports = getPatients;

const Joi = require('joi');

const { abort } = require('../../../helpers/error');
const genderEnum = require('../../../enums/gender');
const appointmentService = require('../../services/appointment');
const appointmentStatus = require('../../../enums/appointmentStatus');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      limit: Joi.number().integer().min(0).required(),
      offset: Joi.number().integer().min(0).required(),
      keyword: Joi.string().allow(null),
      gender: Joi.number().valid(...genderEnum.getValues()).allow(null),
      status: Joi.number().valid(...appointmentStatus.getValues()).allow(null),
    });

    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function getAppointmentList(req, res) {
  const params = {
    limit: req.query.limit,
    offset: req.query.offset,
    keyword: req.query.keyword,
    gender: req.query.gender,
    status: req.query.status,
  };

  await validation(params);

  const responseData = await appointmentService.getAppointmentList(params);
  return res.status(200).send(responseData);
}

module.exports = getAppointmentList;

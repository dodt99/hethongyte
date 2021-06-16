const Joi = require('joi');

const appointmentService = require('../../services/appointment');
const { abort } = require('../../../helpers/error');
// const appointmentStatus = require('../../../enums/appointmentStatus');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      prognosis: Joi.string().allow(null),
      advice: Joi.string().allow(null),
      reExamination: Joi.date().allow(null),
      note: Joi.string().allow(null),
      bodyTemperature: Joi.number().allow(null),
      pulseRate: Joi.number().allow(null),
      bloodPressure: Joi.number().allow(null),
      respirationRate: Joi.number().allow(null),
      date: Joi.date().allow(null),
      content: Joi.string().allow(null),
      doctorId: Joi.number().integer().min(1).required(),
      appointmentId: Joi.number().integer().min(1).required(),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return abort(400, 'Params error');
  }
}

async function addExamination(req, res) {
  const params = {
    prognosis: req.body.prognosis,
    advice: req.body.advice,
    reExamination: req.body.reExamination,
    note: req.body.note,
    bodyTemperature: req.body.bodyTemperature,
    pulseRate: req.body.pulseRate,
    bloodPressure: req.body.bloodPressure,
    respirationRate: req.body.respirationRate,
    date: req.body.date,
    content: req.body.content,
    doctorId: req.user.id,
    appointmentId: +req.params.appointmentId,
  };

  await validation(params);

  await appointmentService.addExamination(params);
  return res.status(201).send();
}

module.exports = addExamination;

const Joi = require('joi');

const appointmentService = require('../../services/appointment');
const { abort } = require('../../../helpers/error');
const examinationType = require('../../../enums/examinationType');
const appointmentStatus = require('../../../enums/appointmentStatus');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      appointmentId: Joi.number().required(),
      startTime: Joi.date().timestamp().required(),
      endTime: Joi.date().timestamp().required(),
      status: Joi.valid(...appointmentStatus.getValues()).required(),
      type: Joi.valid(...examinationType.getValues()).allow(null),
      description: Joi.string().allow(null),
      prognosis: Joi.string().allow(null),
      advice: Joi.string().allow(null),
      reExamination: Joi.date().allow(null),
      note: Joi.string().allow(null),
      // doctorId: Joi.number().integer().min(1).allow(null),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return abort(400, 'Params error');
  }
}

async function updateAppointment(req, res) {
  const params = {
    appointmentId: +req.params.appointmentId,
    startTime: +req.body.startTime,
    endTime: +req.body.endTime,
    status: req.body.status || null,
    type: +req.body.type,
    description: req.body.description,
    prognosis: req.body.prognosis,
    advice: req.body.advice,
    reExamination: req.body.reExamination,
    note: req.body.note,
    // doctorId: req.body.doctorId,
  };

  await validation(params);

  await appointmentService.updateAppointment(params);
  return res.status(204).send();
}

module.exports = updateAppointment;

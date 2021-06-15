const Joi = require('joi');

const appointmentService = require('../../services/appointment');
const { abort } = require('../../../helpers/error');
// const appointmentStatus = require('../../../enums/appointmentStatus');
const examinationType = require('../../../enums/examinationType');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      startTime: Joi.date().timestamp().required(),
      endTime: Joi.date().timestamp().required(),
      // status: Joi.valid(...appointmentStatus.getValues()).required(),
      type: Joi.valid(...examinationType.getValues()).required(),
      description: Joi.string().allow(null),
      prognosis: Joi.string().allow(null),
      advice: Joi.string().allow(null),
      reExamination: Joi.date().allow(null),
      note: Joi.string().allow(null),
      patientId: Joi.number().integer().min(1).required(),
      // doctorId: Joi.number().integer().min(1).allow(null),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return abort(400, 'Params error');
  }
}

async function addAppointment(req, res) {
  const params = {
    startTime: +req.body.startTime,
    endTime: +req.body.endTime,
    // status: +req.body.status,
    type: +req.body.type,
    description: req.body.description,
    prognosis: req.body.prognosis,
    advice: req.body.advice,
    reExamination: req.body.reExamination,
    note: req.body.note,
    patientId: req.user.id,
    // doctorId: req.body.doctorId,
  };

  await validation(params);

  await appointmentService.addAppointment(params);
  return res.status(201).send();
}

module.exports = addAppointment;

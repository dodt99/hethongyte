const Joi = require('joi');

const patientService = require('../../services/patient');
const userStatus = require('../../../enums/userStatus');
const gender = require('../../../enums/gender');
const { abort } = require('../../../helpers/error');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      patientId: Joi.number().integer().required(),
      code: Joi.string().max(31).required(),
      name: Joi.string().max(127).required(),
      gender: Joi.valid(...gender.getValues()).required(),
      tel: Joi.string().max(20).required(),
      birthday: Joi.date().required(),
      address: Joi.string().max(127).required(),
      job: Joi.string().max(127).allow(null),
      status: Joi.valid(...userStatus.getValues()).required(),
      note: Joi.string().allow(null),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function updatePatient(req, res) {
  const params = {
    patientId: Number(req.params.patientId),
    code: req.body.code,
    name: req.body.name,
    gender: Number(req.body.gender),
    tel: req.body.tel,
    birthday: req.body.birthday,
    address: req.body.address,
    job: req.body.job,
    status: req.body.status,
    note: req.body.note,
  };

  await validation(params);

  await patientService.updatePatient(params);
  return res.status(204).send();
}

module.exports = updatePatient;

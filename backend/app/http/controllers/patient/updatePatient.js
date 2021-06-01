const Joi = require('joi');

const patientService = require('../../services/patient');
const gender = require('../../../enums/gender');
const { abort } = require('../../../helpers/error');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      patientId: Joi.number().integer().required(),
      name: Joi.string().max(127).required(),
      gender: Joi.valid(...gender.getValues()).required(),
      birthday: Joi.date().allow(null),
      tel: Joi.string().max(20).allow(null),
      address: Joi.string().max(127).allow(null),
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
    name: req.body.name,
    gender: Number(req.body.gender),
    birthday: req.body.birthday,
    tel: req.body.tel,
    address: req.body.address,
    note: req.body.note,
  };

  await validation(params);

  await patientService.updatePatient(params);
  return res.status(204).send();
}

module.exports = updatePatient;

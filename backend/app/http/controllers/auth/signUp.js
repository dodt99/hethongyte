const Joi = require('joi');
const authService = require('../../services/auth');
const { abort } = require('../../../helpers/error');
const genderEnum = require('../../../enums/gender');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
      name: Joi.string().min(2).max(127).required(),
      gender: Joi.valid(...genderEnum.getValues()).required(),
      tel: Joi.string().max(20).required(),
      birthday: Joi.date().required(),
      address: Joi.string().max(127).required(),
      job: Joi.string().max(127).allow(null),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function signUp(req, res) {
  const params = {
    email: req.body.email,
    password: req.body.password.toString(),
    name: req.body.name,
    gender: +req.body.gender,
    tel: req.body.tel,
    birthday: req.body.birthday,
    address: req.body.address,
    job: req.body.job,
  };

  await validation(params);

  const response = await authService.signUp(params);
  return res.status(200).send(response);
}

module.exports = signUp;

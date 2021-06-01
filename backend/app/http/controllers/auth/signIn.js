const Joi = require('joi');
const authService = require('../../services/auth');
const { abort } = require('../../../helpers/error');

async function validation(params) {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    });
    return await schema.validateAsync(params);
  } catch (error) {
    return abort(400, 'Params error');
  }
}

async function signIn(req, res) {
  const params = {
    email: req.body.email,
    password: req.body.password.toString(),
  };

  await validation(params);

  const response = await authService.signIn(params);
  return res.status(200).send(response);
}

module.exports = signIn;

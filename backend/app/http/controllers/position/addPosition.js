const Joi = require('joi');

const { abort } = require('../../../helpers/error');
const positionService = require('../../services/position');

const validation = async ({ name }) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
    });

    return await schema.validateAsync({ name });
  } catch (e) {
    return abort(400, 'Params Error');
  }
};

const addPosition = async (req, res) => {
  const { name } = req.body;
  await validation({ name });
  await positionService.addPosition({ name });
  res.sendStatus(201);
};

module.exports = addPosition;

const Joi = require('joi');

const { abort } = require('../../../helpers/error');
const positionService = require('../../services/position');

const validation = async ({ name, positionId }) => {
  try {
    const schema = Joi.object().keys({
      positionId: Joi.number().integer().required(),
      name: Joi.string().required(),
    });

    return await schema.validateAsync({ name, positionId });
  } catch (e) {
    return abort(400, 'Params Error');
  }
};

const updatePosition = async (req, res) => {
  const { name } = req.body;
  const { positionId } = req.params;

  await validation({ name, positionId });
  await positionService.updatePosition({ name, positionId });
  res.sendStatus(204);
};

module.exports = updatePosition;

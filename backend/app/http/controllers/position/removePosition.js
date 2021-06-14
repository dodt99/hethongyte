const Joi = require('joi');

const { abort } = require('../../../helpers/error');
const positionService = require('../../services/position');

const validation = async ({ positionId }) => {
  try {
    const schema = Joi.object().keys({
      positionId: Joi.number().integer().required(),
    });

    return await schema.validateAsync({ positionId });
  } catch (e) {
    return abort(400, 'Params Error');
  }
};

const removePosition = async (req, res) => {
  const { positionId } = req.params;

  await validation({ positionId });
  await positionService.removePosition({ positionId });
  res.sendStatus(204);
};

module.exports = removePosition;

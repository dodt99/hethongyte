const Joi = require('joi');

const { abort } = require('../../../helpers/error');
const appointmentService = require('../../services/appointment');

const validation = async (params) => {
  try {
    const schema = Joi.object().keys({
      appointmentId: Joi.number().integer().required(),
    });

    return await schema.validateAsync(params);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return abort(400, 'Params Error');
  }
};

const removeAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  await validation({ appointmentId });
  await appointmentService.removeAppointment({ appointmentId });
  res.sendStatus(204);
};

module.exports = removeAppointment;

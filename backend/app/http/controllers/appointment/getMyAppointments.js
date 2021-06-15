// const Joi = require('joi');

const appointmentService = require('../../services/appointment');

// async function validation(params) {
//   try {
//     const schema = Joi.object().keys({
//       limit: Joi.number().integer().min(0).required(),
//       offset: Joi.number().integer().min(0).required(),
//       keyword: Joi.string().allow(null),
//       gender: Joi.number().valid(...gender.getValues()).allow(null),
//       status: Joi.number().valid(...userStatus.getValues()).allow(null),
//       positionId: Joi.number().integer().min(1).allow(null),
//     });

//     return await schema.validateAsync(params);
//   } catch (error) {
//     return abort(400, 'Params error');
//   }
// }

async function getMyAppointments(req, res) {
  const params = {
    userId: req.user.id,
  };

  // await validation(params);

  const responseData = await appointmentService.getMyAppointments(params);
  return res.status(200).send(responseData);
}

module.exports = getMyAppointments;

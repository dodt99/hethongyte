const { User } = require('../../models');

exports.getProfile = async ({ userId }) => {
  const profile = await User.query()
    .findById(userId)
    .withGraphFetched('appointments')
    .withGraphFetched('appointments.doctor')
    .withGraphFetched('diseaseProgressions')
    .withGraphFetched('vitalSigns');

  return profile;
};

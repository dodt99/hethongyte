const { Model } = require('objection');

class Appointment extends Model {
  static get tableName() {
    return 'appointments';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'appointments.patient_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Appointment;

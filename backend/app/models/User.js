const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Position = require('./Position');
    const Appointment = require('./Appointment');
    const DiseaseProgression = require('./DiseaseProgression');
    const VitalSign = require('./VitalSign');

    return {
      position: {
        relation: Model.BelongsToOneRelation,
        modelClass: Position,
        join: {
          from: 'users.position_id',
          to: 'positions.id',
        },
      },
      appointments: {
        relation: Model.HasManyRelation,
        modelClass: Appointment,
        join: {
          from: 'users.id',
          to: 'appointments.patient_id',
        },
      },
      diseaseProgressions: {
        relation: Model.HasManyRelation,
        modelClass: DiseaseProgression,
        join: {
          from: 'users.id',
          to: 'disease_progressions.user_id',
        },
      },
      vitalSigns: {
        relation: Model.HasManyRelation,
        modelClass: VitalSign,
        join: {
          from: 'users.id',
          to: 'vital_signs.user_id',
        },
      },
    };
  }
}

module.exports = User;

const { Model } = require('objection');

class VitalSign extends Model {
  static get tableName() {
    return 'vital_signs';
  }
}

module.exports = VitalSign;

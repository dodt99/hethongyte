const { Model } = require('objection');

class DiseaseProgression extends Model {
  static get tableName() {
    return 'disease_progressions';
  }
}

module.exports = DiseaseProgression;

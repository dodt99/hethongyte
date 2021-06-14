const { Model } = require('objection');

class Calendar extends Model {
  static get tableName() {
    return 'calendars';
  }
}

module.exports = Calendar;

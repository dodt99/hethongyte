const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'patients';
  }
}

module.exports = User;

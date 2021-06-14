const { Model } = require('objection');

class Position extends Model {
  static get tableName() {
    return 'positions';
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'positions.id',
          to: 'users.position_id',
        },
      },
    };
  }
}

module.exports = Position;

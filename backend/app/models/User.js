const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Position = require('./Position');

    return {
      position: {
        relation: Model.BelongsToOneRelation,
        modelClass: Position,
        join: {
          from: 'users.position_id',
          to: 'positions.id',
        },
      },
    };
  }
}

module.exports = User;

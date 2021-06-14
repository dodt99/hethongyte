const { abort } = require('../../helpers/error');
const { Position } = require('../../models');

exports.getAllPosition = async () => {
  const positions = await Position.query()
    .select('id', 'name')
    .orderBy('id', 'asc');

  return positions;
};

exports.addPosition = async ({ name }) => {
  const position = await Position.query().findOne({ name });

  if (position) return abort(400, 'Position is already exists');

  await Position.query().insert({ name });
  return '';
};

exports.updatePosition = async ({ positionId, name }) => {
  const position = await Position.query().findOne({ name });

  if (position && position.id !== Number(positionId)) {
    return abort(400, 'Position is already exists');
  }

  try {
    await Position.query()
      .findOne({ id: positionId })
      .update({ name });
  } catch (error) {
    return abort(500, 'Can not update position');
  }

  return '';
};

exports.removePosition = async ({ positionId }) => {
  const position = await Position.query()
    .findOne({ id: positionId })
    .withGraphFetched('users')
    .modifyGraph('users', (builder) => {
      builder.select('id').first();
    });

  if (!position) return abort(400, 'Position is not exists');
  if (position && position.users.length !== 0) return abort(400, 'Position has already used');

  try {
    await Position.query().deleteById(positionId);
  } catch (error) {
    return abort(500, 'Can not remove position');
  }

  return '';
};

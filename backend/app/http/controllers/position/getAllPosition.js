const positionService = require('../../services/position');

async function getAllPosition(req, res) {
  const responseData = await positionService.getAllPosition();

  return res.status(200).send(responseData);
}

module.exports = getAllPosition;

const userService = require('../../services/user');

async function getProfile(req, res) {
  const userId = +req.params.userId;
  const responseData = await userService.getProfile({ userId });

  return res.status(200).send(responseData);
}

module.exports = getProfile;

function me(req, res) {
  const responseData = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
  };

  return res.status(200).send(responseData);
}

module.exports = me;

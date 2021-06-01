function me(req, res) {
  const responseData = {
    id: req.user.id,
    name: req.user.name,
  };

  return res.status(200).send(responseData);
}

module.exports = me;

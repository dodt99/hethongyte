const express = require('express');

const { user: userController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.get('/users/:userId', auth, userController.getProfile);

module.exports = router;

const express = require('express');
const { auth: authController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.get('/me', auth, authController.me);
router.post('/sign-in', authController.signIn);

module.exports = router;

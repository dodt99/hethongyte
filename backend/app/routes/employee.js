const express = require('express');

const { auth } = require('../http/middlewares');
const { employee: employeeController } = require('../http/controllers');

const router = express.Router();

router.get('/employees', auth, employeeController.getEmployees);
router.post('/employees', auth, employeeController.addEmployee);

module.exports = router;

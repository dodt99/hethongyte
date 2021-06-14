const express = require('express');

const { employee: employeeController } = require('../http/controllers');

const router = express.Router();

router.get('/employees', employeeController.getEmployees);
router.post('/employees', employeeController.addEmployee);

module.exports = router;

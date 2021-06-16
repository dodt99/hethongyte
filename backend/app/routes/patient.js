const express = require('express');

const { patient: patientController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.get('/patients', auth, patientController.getPatients);
router.put('/patients/:patientId', auth, patientController.updatePatient);

module.exports = router;

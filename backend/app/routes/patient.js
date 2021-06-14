const express = require('express');

const { patient: patientController } = require('../http/controllers');

const router = express.Router();

router.get('/patients', patientController.getPatients);
router.put('/patients/:patientId', patientController.updatePatient);

module.exports = router;

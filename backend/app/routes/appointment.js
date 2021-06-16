const express = require('express');
const { appointment: appointmentController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/appointments', auth, appointmentController.addAppointment);
router.get('/appointments', auth, appointmentController.getAllAppointments);
router.get('/appointment-list', auth, appointmentController.getAppointmentList);
router.get('/my-appointments', auth, appointmentController.getMyAppointments);
router.put('/appointments/:appointmentId', auth, appointmentController.updateAppointment);
router.delete('/appointments/:appointmentId', auth, appointmentController.removeAppointment);

router.post('/appointments/:appointmentId/examinations', auth, appointmentController.addExamination);

module.exports = router;

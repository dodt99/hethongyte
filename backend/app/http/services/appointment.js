const appointmentStatus = require('../../enums/appointmentStatus');
const { formatTimestamp } = require('../../helpers/dayjs');
const { abort } = require('../../helpers/error');
const { Appointment } = require('../../models');

exports.addAppointment = async ({
  startTime,
  endTime,
  // status,
  type,
  description,
  prognosis,
  advice,
  reExamination,
  note,
  patientId,
  // doctorId,
}) => {
  try {
    await Appointment.query().insert({
      start_time: formatTimestamp(startTime),
      end_time: formatTimestamp(endTime),
      status: appointmentStatus.CHO_XAC_NHAN,
      type,
      description,
      prognosis,
      advice,
      re_examination: reExamination,
      note,
      patient_id: patientId,
      // doctor_id: doctorId,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    abort(500, 'Can not add new appointment');
  }
  return '';
};

exports.updateAppointment = async ({
  appointmentId,
  startTime,
  endTime,
  status,
  type,
  description,
  prognosis,
  advice,
  reExamination,
  note,
  // doctorId,
}) => {
  try {
    await Appointment.query().updateAndFetchById(appointmentId, {
      start_time: formatTimestamp(startTime),
      end_time: formatTimestamp(endTime),
      status,
      type,
      description,
      prognosis,
      advice,
      re_examination: reExamination,
      note,
      // doctor_id: doctorId,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    abort(500, 'Can not update appointment');
  }
  return '';
};

exports.getAllAppointments = async () => {
  const appointments = await Appointment.query()
    .withGraphFetched('patient');

  return appointments;
};

exports.getMyAppointments = async ({ userId }) => {
  const appointments = await Appointment.query()
    .where('patient_id', userId)
    .orderBy('id', 'desc');

  return appointments;
};

exports.removeAppointment = async ({ appointmentId }) => {
  try {
    await Appointment.query().deleteById(appointmentId);
  } catch (error) {
    return abort(500, 'Can not remove appointment');
  }

  return '';
};

const dayjs = require('dayjs');
const appointmentStatus = require('../../enums/appointmentStatus');
const { formatTimestamp } = require('../../helpers/dayjs');
const { abort } = require('../../helpers/error');
const { Appointment, VitalSign, DiseaseProgression } = require('../../models');

// eslint-disable-next-line no-control-regex
const hasUnicode = (s) => /[^\u0000-\u007f]/.test(s);

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

exports.getAppointmentList = async ({
  limit, offset, keyword, gender, status,
}) => {
  const startToday = new Date(dayjs().hour(0).minute(0).second(0));
  const endToday = new Date(dayjs().hour(0).minute(0).second(0)
    .add(1, 'day'));

  let appointments = Appointment.query()
    .leftJoin('users', 'appointments.patient_id', 'users.id')
    .where('start_time', '>=', startToday).andWhere('start_time', '<=', endToday)
    .withGraphFetched('patient')
    .orderBy('appointments.start_time')
    .offset(offset)
    .limit(limit);

  let total = Appointment.query()
    .leftJoin('users', 'appointments.patient_id', 'users.id')
    .count('appointments.id');

  if (keyword) {
    appointments.where((builder) => {
      if (hasUnicode(keyword)) {
        builder
          .where('users.name', 'like', `%${keyword}%`);
      } else {
        builder
          .orWhere('users.name', 'like', `%${keyword}%`)
          .orWhere('users.code', 'like', `%${keyword}%`)
          .orWhere('users.email', 'like', `%${keyword}%`)
          .orWhere('users.tel', 'like', `%${keyword}%`);
      }
    });

    total.where((builder) => {
      if (hasUnicode(keyword)) {
        builder
          .where('users.name', 'like', `%${keyword}%`);
      } else {
        builder
          .orWhere('users.name', 'like', `%${keyword}%`)
          .orWhere('users.code', 'like', `%${keyword}%`)
          .orWhere('users.email', 'like', `%${keyword}%`)
          .orWhere('users.tel', 'like', `%${keyword}%`);
      }
    });
  }

  if (gender) {
    appointments.where('users.gender', gender);
    total.where('users.gender', gender);
  }

  if (status) {
    appointments.where('appointments.status', status);
    total.where('appointments.status', status);
  }

  appointments = await appointments;
  [{ 'count(`appointments`.`id`)': total }] = await total;

  return {
    appointments,
    total,
    limit,
    offset,
  };
};

exports.removeAppointment = async ({ appointmentId }) => {
  try {
    await Appointment.query().deleteById(appointmentId);
  } catch (error) {
    return abort(500, 'Can not remove appointment');
  }

  return '';
};

exports.addExamination = async ({
  prognosis, advice, reExamination, note, bodyTemperature,
  pulseRate, bloodPressure, respirationRate, date, content,
  doctorId, appointmentId,
}) => {
  try {
    const appointment = await Appointment.query().updateAndFetchById(appointmentId, {
      prognosis,
      advice,
      re_examination: reExamination,
      note,
      doctor_id: doctorId,
      status: appointmentStatus.DA_KHAM,
    });

    if (bodyTemperature || pulseRate || bloodPressure || respirationRate) {
      await VitalSign.query().insert({
        body_temperature: bodyTemperature,
        pulse_rate: pulseRate,
        respiration_rate: respirationRate,
        blood_pressure: bloodPressure,
        user_id: appointment.patient_id,
      });
    }

    if (content) {
      await DiseaseProgression.query().insert({
        user_id: appointment.patient_id,
        date,
        content,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    abort(500, 'Can not add new examination');
  }
  return '';
};

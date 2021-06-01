const { abort } = require('../../helpers/error');
const { Patient } = require('../../models');

// eslint-disable-next-line no-control-regex
const hasUnicode = (s) => /[^\u0000-\u007f]/.test(s);

exports.addPatient = async ({
  name, gender, birthday, tel, address, note,
}) => {
  try {
    await Patient.query().insert({
      name, gender, birthday, tel, address, note,
    });
  } catch (error) {
    return abort(500, 'Can not add new patient');
  }

  return '';
};

exports.getPatients = async ({
  limit, offset, keyword, gender, sortBy, sortType,
}) => {
  let patients = Patient.query()
    .select('id', 'name', 'gender', 'birthday', 'tel', 'address', 'note', 'created_at')
    .orderBy(sortBy, sortType)
    .limit(limit)
    .offset(offset);

  let total = Patient.query().count('id');

  if (keyword) {
    patients.where((builder) => {
      if (hasUnicode(keyword)) {
        builder
          .where('name', 'like', `%${keyword}%`);
      } else {
        builder
          .orWhere('name', 'like', `%${keyword}%`)
          .orWhere('tel', 'like', `%${keyword}%`);
      }
    });

    total.where((builder) => {
      if (hasUnicode(keyword)) {
        builder
          .where('name', 'like', `%${keyword}%`);
      } else {
        builder
          .orWhere('name', 'like', `%${keyword}%`)
          .orWhere('tel', 'like', `%${keyword}%`);
      }
    });
  }

  if (gender) {
    patients.where({ gender });
    total.where({ gender });
  }

  patients = await patients;
  [{ 'count(`id`)': total }] = await total;

  return {
    patients,
    total,
    limit,
    offset,
  };
};

exports.updatePatient = async ({
  patientId, name, gender, birthday, tel, address, note,
}) => {
  const patient = await Patient.query().findById(patientId);
  if (!patient) return abort(404, 'Patient is not exists');

  try {
    await patient.$query()
      .update({
        name, gender, birthday, tel, address, note,
      });
  } catch (error) {
    return abort(500, 'Can not update patient');
  }

  return '';
};

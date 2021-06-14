const role = require('../../enums/role');
const { abort } = require('../../helpers/error');
const { User } = require('../../models');

// eslint-disable-next-line no-control-regex
const hasUnicode = (s) => /[^\u0000-\u007f]/.test(s);

exports.getPatients = async ({
  limit, offset, keyword, gender, status, sortBy, sortType,
}) => {
  let patients = User.query()
    .select('id', 'code', 'email', 'name', 'gender', 'birthday', 'address', 'tel', 'status', 'note', 'created_at')
    .where('role', role.PATIENT)
    .orderBy(sortBy, sortType)
    .limit(limit)
    .offset(offset);

  let total = User.query()
    .where('role', role.PATIENT)
    .count('id');

  if (keyword) {
    patients.where((builder) => {
      if (hasUnicode(keyword)) {
        builder
          .where('name', 'like', `%${keyword}%`);
      } else {
        builder
          .orWhere('name', 'like', `%${keyword}%`)
          .orWhere('code', 'like', `%${keyword}%`)
          .orWhere('email', 'like', `%${keyword}%`)
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

  if (status) {
    patients.where({ status });
    total.where({ status });
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
  patientId, code, name, gender, birthday, tel, address, note, job, status,
}) => {
  const patient = await User.query().findById(patientId);
  if (!patient) return abort(404, 'Patient is not exists');

  try {
    await patient.$query()
      .update({
        code, name, gender, birthday, tel, address, note, job, status,
      });
  } catch (error) {
    return abort(500, 'Can not update patient');
  }

  return '';
};

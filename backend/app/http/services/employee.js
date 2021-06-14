const bcrypt = require('bcrypt');

const role = require('../../enums/role');
const userStatus = require('../../enums/userStatus');
const roleEnum = require('../../enums/role');
const { abort } = require('../../helpers/error');
const { User, Position } = require('../../models');

// eslint-disable-next-line no-control-regex
const hasUnicode = (s) => /[^\u0000-\u007f]/.test(s);

exports.addEmployee = async ({
  code, name, gender, email, birthday, tel, address, qualification, experiece, fromAt, toAt,
  positionId, note, aliasName,
}) => {
  const user = await User.query().findOne({ email });
  if (user) return abort(400, 'Email already exist');

  const position = await Position.query().findById(positionId);
  if (!position) return abort(400, 'Position is not exist');

  const hashPassword = await bcrypt.hash('password', 10);

  try {
    await User.query().insert({
      code,
      name,
      alias_name: aliasName,
      gender,
      email,
      birthday,
      tel,
      address,
      qualification,
      experiece,
      from_at: fromAt,
      to_at: toAt,
      status: userStatus.ACTIVE,
      position_id: positionId,
      note,
      password: hashPassword,
      role: roleEnum.EMPLOYEE,
    });
  } catch (error) {
    return abort(500, 'Can not add new employee');
  }

  return '';
};

exports.getEmployees = async ({
  limit, offset, keyword, gender, status, positionId,
}) => {
  let employees = User.query()
    .where('role', role.EMPLOYEE)
    .withGraphFetched('position')
    .limit(limit)
    .offset(offset);

  let total = User.query()
    .where('role', role.EMPLOYEE)
    .count('id');

  if (keyword) {
    employees.where((builder) => {
      if (hasUnicode(keyword)) {
        builder
          .where('name', 'like', `%${keyword}%`);
      } else {
        builder
          .orWhere('name', 'like', `%${keyword}%`)
          .orWhere('alias_name', 'like', `%${keyword}%`)
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
    employees.where({ gender });
    total.where({ gender });
  }

  if (status) {
    employees.where({ status });
    total.where({ status });
  }

  if (positionId) {
    employees.where({ position_id: positionId });
    total.where({ position_id: positionId });
  }

  employees = await employees;
  [{ 'count(`id`)': total }] = await total;

  return {
    employees,
    total,
    limit,
    offset,
  };
};

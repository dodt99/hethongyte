const bcrypt = require('bcrypt');

const { generate } = require('../../helpers/jwt');
const { User } = require('../../models');
const { abort } = require('../../helpers/error');
const userStatus = require('../../enums/userStatus');
const role = require('../../enums/role');

const saltRounds = 10;

exports.signIn = async ({ email, password }) => {
  const user = await User.query().findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return abort(400, 'Email or password is incorrect');
  }
  const accessToken = await generate({ userId: user.id });
  return { accessToken };
};

exports.signUp = async ({
  email, password, name, gender, tel, birthday, address, job,
}) => {
  const user = await User.query().findOne({ email });

  if (user) {
    return abort(400, 'Email already exist');
  }

  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.query().insertAndFetch({
      email,
      password: hashPassword,
      name,
      gender,
      tel,
      birthday,
      address,
      job,
      status: userStatus.ACTIVE,
      role: role.PATIENT,
    });

    const accessToken = await generate({ userId: newUser.id });

    return { accessToken };
  } catch (error) {
    return abort(500, 'Can not sign up');
  }
};

const bcrypt = require('bcrypt');

const { generate } = require('../../helpers/jwt');
const { User } = require('../../models');
const { abort } = require('../../helpers/error');

const saltRounds = 10;

exports.signIn = async ({ email, password }) => {
  const user = await User.query().findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return abort(400, 'Email or password is incorrect');
  }
  const accessToken = await generate({ userId: user.id });
  return { accessToken };
};

exports.signUp = async ({ email, password, fullName }) => {
  const user = await User.query().findOne({ email });

  if (user) {
    return abort(400, 'Email already exist');
  }

  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);

    await User.query().insert({
      email,
      password: hashPassword,
      full_name: fullName,
      task_count: 0,
    });

    return '';
  } catch (error) {
    return abort(500, 'Can not sign up');
  }
};

const bcrypt = require('bcrypt');
const role = require('../../app/enums/role');
const userStatus = require('../../app/enums/userStatus');

const saltRounds = 10;

exports.seed = async (knex) => {
  await knex('users').insert([{
    code: 'NV001',
    email: 'do.dinhtien227@gmail.com',
    password: await bcrypt.hash('dodt123', saltRounds),
    name: 'Tien Do',
    gender: 1,
    tel: '09875656',
    birthday: '1999-01-22',
    address: 'Thanh Tri',
    status: userStatus.ACTIVE,
    role: role.ADMIN,
    position_id: 1,
  }]);
};

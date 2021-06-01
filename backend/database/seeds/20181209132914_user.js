const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.seed = async (knex) => {
  await knex('users').insert([{
    email: 'do.dinhtien227@gmail.com',
    password: await bcrypt.hash('dodt123', saltRounds),
    name: 'Tien Do',
  }]);
};

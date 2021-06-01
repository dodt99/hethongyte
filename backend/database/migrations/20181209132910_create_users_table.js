exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email', 127).collate('latin1_general_ci');
    table.string('password', 127).collate('latin1_general_ci');
    table.string('name', 127).collate('utf8_general_ci');

    table.timestamps(true, true);

    table.unique('email');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};

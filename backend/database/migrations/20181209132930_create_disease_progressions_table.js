exports.up = async (knex) => {
  await knex.schema.createTable('disease_progressions', (table) => {
    table.increments('id');

    table.date('date');
    table.text('content').collate('utf8_general_ci');

    table.integer('user_id').unsigned().references('users.id').notNullable();

    table.timestamps(true, true);

    table.index('user_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('disease_progressions');
};

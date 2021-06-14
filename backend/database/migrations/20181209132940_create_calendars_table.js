exports.up = async (knex) => {
  await knex.schema.createTable('calendars', (table) => {
    table.increments('id');

    table.date('date').notNullable();
    table.time('time', { precision: 6 }).notNullable();
    table.tinyint('status', 1).unsigned().notNullable();
    table.string('prognosis').collate('utf8_general_ci').notNullable();
    table.text('advice').collate('utf8_general_ci');
    table.date('re_examination');
    table.text('note').collate('utf8_general_ci');

    table.integer('patient_id').unsigned().references('users.id').notNullable();
    table.integer('doctor_id').unsigned().references('users.id').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('calendars');
};

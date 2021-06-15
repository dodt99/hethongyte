exports.up = async (knex) => {
  await knex.schema.createTable('appointments', (table) => {
    table.increments('id');

    table.datetime('start_time').notNullable();
    table.datetime('end_time').notNullable();
    table.tinyint('status', 1).unsigned().notNullable();
    table.tinyint('type', 1).unsigned().notNullable();
    table.text('description').collate('utf8_general_ci').nullable();
    table.string('prognosis').collate('utf8_general_ci').nullable();
    table.text('advice').collate('utf8_general_ci').nullable();
    table.date('re_examination').nullable();
    table.text('note').collate('utf8_general_ci').nullable();

    table.integer('patient_id').unsigned().references('users.id').notNullable();
    table.integer('doctor_id').unsigned().references('users.id').nullable();

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('appointments');
};

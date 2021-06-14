exports.up = async (knex) => {
  await knex.schema.createTable('vital_signs', (table) => {
    table.increments('id');

    table.float('body_temperature').notNullable();
    table.float('pulse_rate').notNullable();
    table.float('respiration_rate').notNullable();
    table.float('blood_pressure').notNullable();
    table.float('height');
    table.float('weight');

    table.integer('user_id').unsigned().references('users.id').notNullable();

    table.timestamps(true, true);

    table.index('user_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('vital_signs');
};

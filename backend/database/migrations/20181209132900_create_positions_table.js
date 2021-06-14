exports.up = async (knex) => {
  await knex.schema.createTable('positions', (table) => {
    table.increments('id');
    table.string('name', 31).notNullable();

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('positions');
};

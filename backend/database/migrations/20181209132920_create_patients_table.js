exports.up = async (knex) => {
  await knex.schema.createTable('patients', (table) => {
    table.increments('id');
    table.string('name', 127).collate('utf8_general_ci').notNullable();
    table.tinyint('gender', 1).unsigned().notNullable();
    table.date('birthday');
    table.string('tel', 20).collate('latin1_general_ci');
    table.string('address', 127).collate('latin1_general_ci');
    table.text('note').collate('utf8_general_ci');

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('patients');
};

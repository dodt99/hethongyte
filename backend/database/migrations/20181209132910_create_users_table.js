exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('code', 31).collate('latin1_general_ci');
    table.string('email', 127).collate('latin1_general_ci').notNullable();
    table.string('password', 127).collate('latin1_general_ci').notNullable();
    table.string('name', 127).collate('utf8_general_ci').notNullable();
    table.tinyint('gender', 1).unsigned().notNullable();
    table.string('tel', 20).collate('latin1_general_ci').notNullable();
    table.date('birthday').notNullable();
    table.string('address', 127).collate('utf8_general_ci').notNullable();
    table.string('job', 127).collate('utf8_general_ci');
    table.tinyint('status', 1).unsigned().notNullable();
    table.tinyint('role', 1).unsigned().notNullable();
    table.text('note').collate('utf8_general_ci');

    table.string('alias_name', 127).collate('utf8_general_ci');
    table.string('qualification', 255).collate('utf8_general_ci');
    table.string('experience', 255).collate('utf8_general_ci');
    table.date('from_at');
    table.date('to_at');

    table.integer('position_id').unsigned().references('positions.id').nullable();

    table.timestamps(true, true);

    table.index('position_id');

    table.unique('email');
    table.unique('code');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};

exports.seed = async (knex) => {
  await knex('positions').insert([
    {
      name: 'Administrator',
    },
    {
      name: 'Bác sĩ',
    },
    {
      name: 'Y tá',
    },
    {
      name: 'NV Kỹ thuật',
    },
  ]);
};

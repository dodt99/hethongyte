import yup from './yup';

const schema = yup.object().shape({
  name: yup
    .string()
    .max(127)
    .trim()
    .required(),
  tel: yup
    .string()
    .matches(/^\+?[0-9]*$/, 'Phone number is not valid')
    .max(20)
    .nullable(),
  gender: yup.number().required(),
  birthday: yup.date().nullable(),
  address: yup.string().max(127).nullable(),
  note: yup.string().nullable(),
});

export default schema;

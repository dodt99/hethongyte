import yup from './yup';

const schema = yup.object().shape({
  code: yup.string().min(3).max(31).required(),
  email: yup.string().email().required(),
  name: yup.string().max(127).trim().required(),
  gender: yup.number().required(),
  tel: yup
    .string()
    .matches(/^\+?[0-9]*$/, 'Phone number is not valid')
    .max(20)
    .required(),
  birthday: yup.date().required(),
  address: yup.string().max(127).required(),
  note: yup.string().nullable(),
  aliasName: yup.string().max(127).trim().nullable(),
  qualification: yup.string().nullable(),
  experience: yup.string().nullable(),
  fromAt: yup.date().nullable(),
  toAt: yup.date().nullable(),
  position: yup.object().required(),
});

export default schema;

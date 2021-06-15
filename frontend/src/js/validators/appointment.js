import yup from './yup';

const schema = yup.object().shape({
  day: yup.object().required(),
  hour: yup.object().required(),
  type: yup.number().required(),
  description: yup.string().nullable(),
});

export default schema;

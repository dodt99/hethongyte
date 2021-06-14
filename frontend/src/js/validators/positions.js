import yup from './yup';

const positions = yup.object().shape({
  name: yup
    .string()
    .max(127)
    .required(),
});

export default positions;

import yup from './yup';

const schema = yup.object().shape({
  prognosis: yup.string().required(),
  advice: yup.string().nullable(),
  reExamination: yup.date().nullable(),
  note: yup.string().nullable(),
  bodyTemperature: yup.string().nullable(),
  pulseRate: yup.string().nullable(),
  bloodPressure: yup.string().nullable(),
  respirationRate: yup.string().nullable(),
  date: yup.date().nullable(),
  content: yup.string().nullable(),
});

export default schema;

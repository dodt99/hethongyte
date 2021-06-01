/* eslint-disable no-template-curly-in-string */
import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notType: 'This field must type ${type}',
  },
});

export default yup;

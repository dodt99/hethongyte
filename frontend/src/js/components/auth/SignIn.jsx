import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import {
  Box, Button, FormGroup, TextField,
} from '@material-ui/core';

import { setToken, api } from '../../helpers/axios';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
});

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();

  const {
    register, handleSubmit, errors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: handleSignIn, isLoading } = useMutation(
    ({ email, password }) => api.post('/sign-in', { email, password }),
    {
      onSuccess: (res) => {
        setToken(res.data.accessToken);
        history.push('/');
      },
      onError: () => {
        setErrorMessage('Email or password is incorrect');
      },
    },
  );

  const onSubmit = ({ email, password }) => {
    handleSignIn({ email, password });
  };

  return (
    <FormGroup>
      <TextField
        name="email"
        label="Email"
        autoComplete="off"
        fullWidth
        variant="outlined"
        inputRef={register}
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : ''}
      />

      <TextField
        name="password"
        label="Password"
        autoComplete="off"
        type="password"
        fullWidth
        variant="outlined"
        inputRef={register}
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
      />

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Box justifyContent="flex-end" display="flex">
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </Button>
      </Box>
    </FormGroup>
  );
};

export default SignIn;

import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import {
  Box, Button, FormGroup, TextField, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { setToken, api } from '../../helpers/axios';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
});

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    width: '400px',
  },
  button: {
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
}));

const SignIn = () => {
  const classes = useStyles();
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
    <Paper className={classes.paper}>
      <Typography variant="h3" className={classes.title}>SIGN IN</Typography>
      <FormGroup>
        <TextField
          name="email"
          label="Email"
          autoComplete="off"
          fullWidth
          variant="outlined"
          inputRef={register}
          className={classes.input}
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
          className={classes.input}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
        />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            fullWidth
            className={classes.button}
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>

          <Button
            color="primary"
            variant="outlined"
            onClick={() => history.push('/sign-up')}
            fullWidth
            className={classes.button}
          >
            SIGN UP
          </Button>
        </Box>
      </FormGroup>
    </Paper>
  );
};

export default SignIn;

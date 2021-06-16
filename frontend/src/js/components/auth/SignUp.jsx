import React from 'react';
import { useMutation } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import {
  Box, Button, FormGroup, TextField, Paper, Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { setToken, api } from '../../helpers/axios';
import genderEnum from '../../enums/gender';
import { formatLocalDate } from '../../helpers/date';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
  name: yup.string().min(2).max(127).required(),
  gender: yup.object().required(),
  tel: yup.string().max(20).required(),
  birthday: yup.date().required(),
  address: yup.string().max(127).required(),
  job: yup.string().max(127).nullable(),
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

const SignUp = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const {
    register, handleSubmit, errors, control, watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      birthday: null,
    },
  });

  const {
    email, name, gender, tel, birthday, address, job, password,
  } = watch();

  const { mutate: handleSignUp, isLoading } = useMutation(
    () => api.post('/sign-up', {
      email,
      password,
      name,
      gender: gender.value,
      tel,
      birthday: (birthday && formatLocalDate(birthday)) || null,
      address,
      job: job || null,
    }),
    {
      onSuccess: (res) => {
        setToken(res.data.accessToken);
        history.push('/');
      },
      onError: (err) => {
        enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
      },
    },
  );

  const onSubmit = (params) => {
    handleSignUp(params);
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3" className={classes.title}>SIGN UP</Typography>

      <FormGroup>
        <TextField
          name="email"
          label="Email"
          autoComplete="off"
          fullWidth
          variant="outlined"
          className={classes.input}
          inputRef={register}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
        />

        <TextField
          name="password"
          type="password"
          label="Mật khẩu"
          autoComplete="off"
          fullWidth
          className={classes.input}
          variant="outlined"
          inputRef={register}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
        />

        <TextField
          name="name"
          label="Họ tên"
          autoComplete="off"
          fullWidth
          className={classes.input}
          variant="outlined"
          inputRef={register}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
        />

        <Controller
          name="gender"
          control={control}
          render={({ onChange, ...props }) => (
            <Autocomplete
              {...props}
              id="gender"
              className={classes.input}
              size="small"
              filterSelectedOptions
              options={genderEnum.toArray() || []}
              getOptionLabel={(option) => genderEnum.getTitle(option.value)}
              renderInput={
                (params) => <TextField {...params} label="Giới tính" variant="outlined" />
              }
              onChange={(_, val) => {
                onChange(val);
              }}
            />
          )}
        />

        <TextField
          name="tel"
          label="Số điện thoại"
          autoComplete="off"
          className={classes.input}
          fullWidth
          variant="outlined"
          inputRef={register}
          error={!!errors.tel}
          helperText={errors.tel ? errors.tel.message : ''}
        />

        <Controller
          render={({ onChange, ...props }) => (
            <KeyboardDatePicker
              {...props}
              inputVariant="outlined"
              label="Ngày sinh"
              placeholder="dd-mm-yyyy"
              name="birthday"
              className={classes.input}
              autoOk
              format="DD-MM-YYYY"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.birthday}
              helperText={errors.birthday ? errors.birthday.message : ''}
              onChange={(e) => onChange(e || null)}
            />
          )}
          name="birthday"
          control={control}
        />

        <TextField
          name="address"
          label="Địa chỉ"
          autoComplete="off"
          className={classes.input}
          fullWidth
          variant="outlined"
          inputRef={register}
          error={!!errors.address}
          helperText={errors.address ? errors.address.message : ''}
        />

        <TextField
          name="job"
          label="Nghề nghiệp"
          className={classes.input}
          autoComplete="off"
          fullWidth
          variant="outlined"
          inputRef={register}
          error={!!errors.job}
          helperText={errors.job ? errors.job.message : ''}
        />

        <Box>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            className={classes.button}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Loading...' : 'Sign Up'}
          </Button>

          <Button
            color="primary"
            variant="outlined"
            onClick={() => history.push('/sign-in')}
            fullWidth
            className={classes.button}
          >
            SIGN IN
          </Button>
        </Box>
      </FormGroup>
    </Paper>
  );
};

export default SignUp;

import React from 'react';
import { useMutation } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import {
  Box, Button, FormGroup, TextField,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
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

const SignUp = () => {
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
        type="password"
        label="Mật khẩu"
        autoComplete="off"
        fullWidth
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
        fullWidth
        variant="outlined"
        inputRef={register}
        error={!!errors.address}
        helperText={errors.address ? errors.address.message : ''}
      />

      <TextField
        name="job"
        label="Nghề nghiệp"
        autoComplete="off"
        fullWidth
        variant="outlined"
        inputRef={register}
        error={!!errors.job}
        helperText={errors.job ? errors.job.message : ''}
      />

      <Box justifyContent="flex-end" display="flex">
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </Button>
      </Box>
    </FormGroup>
  );
};

export default SignUp;

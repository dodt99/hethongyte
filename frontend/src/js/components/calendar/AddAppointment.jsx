import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography, TextField, Button, Paper,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';
import { yupResolver } from '@hookform/resolvers';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';

import { api } from '../../helpers/axios';
import { formatLocalHour, getDay, localDate } from '../../helpers/date';
import addAppointmentSchema from '../../validators/appointment';
import examinationType from '../../enums/examinationType';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
  },
  title: {
    // marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    lineHeight: '100%',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  field: {
    marginRight: theme.spacing(1),
    width: '180px',
  },
  largeField: {
    marginRight: theme.spacing(1),
    width: '400px',
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));

const AddAppointment = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(addAppointmentSchema),
    mode: 'onChange',
    defaultValues: {
      day: {
        value: new Date(dayjs().hour(0).minute(0).second(0)).getTime(),
        title: localDate(new Date(dayjs().hour(0).minute(0).second(0)).getTime()).toString(),
      },
      hour: null,
    },
  });

  const {
    day, hour, type, description,
  } = watch();

  const { mutate: addAppointment, isLoading } = useMutation(async () => {
    const appointment = await api.post('/appointments', {
      startTime: day.value + hour.value,
      endTime: day.value + hour.value + 30 * 60 * 1000,
      type,
      description: description || null,
    });
    return appointment;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Thêm lịch khám thành công', { variant: 'success' });
      await queryClient.invalidateQueries('appointments');
      await queryClient.invalidateQueries('my-appointments');
      reset();
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  const generateArrayOfDays = useCallback(() => {
    const today = new Date(dayjs().hour(0).minute(0).second(0)).getTime();
    const endNextWeek = new Date(dayjs(new Date()).add(2, 'week').endOf('isoWeek')).getTime();

    const days = [];

    for (let i = today; i <= endNextWeek; i += 24000 * 60 * 60) {
      if (getDay(i) !== 7) {
        days.push({
          value: i,
          title: localDate(i).toString(),
        });
      }
    }

    return days;
  }, []);

  const generateArrayOfHours = useCallback(() => {
    const startMorning = new Date(dayjs().hour(7).minute(30).second(0)).getTime();
    const endMorning = new Date(dayjs().hour(11).minute(0).second(0)).getTime();

    const startAfternoon = new Date(dayjs().hour(13).minute(30).second(0)).getTime();
    const endAfternoon = new Date(dayjs().hour(17).minute(30).second(0)).getTime();

    const hours = [];

    for (let i = startMorning; i <= endMorning; i += 30 * 60 * 1000) {
      hours.push({
        value: i - new Date(dayjs().hour(0).minute(0).second(0)),
        title: `${formatLocalHour(i)} - ${formatLocalHour(i + 30 * 60000)}`,
      });
    }

    for (let i = startAfternoon; i <= endAfternoon; i += 30 * 60 * 1000) {
      hours.push({
        value: i - new Date(dayjs().hour(0).minute(0).second(0)),
        title: `${formatLocalHour(i)} - ${formatLocalHour(i + 30 * 60000)}`,
      });
    }

    return hours;
  }, []);

  return (
    <Paper className={classes.paper}>
      <div className={classes.flex}>
        <Typography variant="h4" className={classes.title}>
          Đặt lịch khám:
        </Typography>
        <Controller
          name="day"
          control={control}
          render={({ onChange, ...props }) => (
            <Autocomplete
              {...props}
              id="day"
              size="small"
              className={classes.field}
              options={generateArrayOfDays() || []}
              getOptionLabel={(option) => option.title}
              getOptionSelected={(option, value) => option.title === value.title}
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    label="Ngày"
                    variant="outlined"
                    error={!!errors.day}
                    // helperText={errors.day ? errors.day.message : ''}
                  />
                )
              }
              onChange={(_, val) => {
                onChange(val);
              }}
            />
          )}
        />

        <Controller
          name="hour"
          control={control}
          render={({ onChange, ...props }) => (
            <Autocomplete
              {...props}
              size="small"
              className={classes.field}
              options={generateArrayOfHours() || []}
              getOptionLabel={(option) => option.title}
              getOptionSelected={(option, value) => option.title === value.title}
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    label="Giờ"
                    variant="outlined"
                    error={!!errors.hour}
                    // helperText={errors.hour ? errors.hour.message : ''}
                  />
                )
              }
              onChange={(_, val) => {
                onChange(val);
              }}
            />
          )}
        />

        <Controller
          name="type"
          defaultValue={null}
          control={control}
          render={({ onChange, ...props }) => (
            <Autocomplete
              {...props}
              size="small"
              className={classes.field}
              options={examinationType.getValues()}
              getOptionLabel={(option) => examinationType.getTitle(option)}
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    label="Dịch vụ"
                    variant="outlined"
                    error={!!errors.type}
                    // helperText={errors.type ? errors.type.message : ''}
                  />
                )
              }
              onChange={(_, val) => {
                onChange(val);
              }}
            />
          )}
        />

        <TextField
          label="Mô tả..."
          name="description"
          size="small"
          className={classes.largeField}
          variant="outlined"
          inputRef={register}
          error={!!errors.description}
          helperText={errors.description ? errors.description.message : ''}
        />

        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={handleSubmit(addAppointment)}
          disabled={isLoading}
        >
          Đặt Lịch
        </Button>
      </div>
    </Paper>
  );
};

export default AddAppointment;

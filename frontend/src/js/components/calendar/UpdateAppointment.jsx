/* eslint-disable max-len */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  DialogTitle, Dialog, DialogContent, TextField, Button, Tooltip, IconButton, Grid,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { yupResolver } from '@hookform/resolvers';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';

import { api } from '../../helpers/axios';
import appointmentSchema from '../../validators/appointment';
import examinationType from '../../enums/examinationType';
import { formatLocalHour, getDay, localDate } from '../../helpers/date';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  buttons: {
    float: 'right',
    marginTop: theme.spacing(2),
  },
}));

const UpdateAppointment = ({ appointment }) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    mode: 'onSubmit',
  });

  const {
    day, hour, type, description,
  } = watch();

  const { mutate: updateAppointment, isLoading } = useMutation(async () => {
    const newAppointment = await api.put(`/appointments/${appointment.id}`, {
      startTime: day.value + hour.value,
      endTime: day.value + hour.value + 30 * 60 * 1000,
      status: appointment.status,
      type,
      description: description || null,
    });
    return newAppointment;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Sửa lịch khám thành công', { variant: 'success' });
      setOpen(false);
      await queryClient.invalidateQueries('appointments');
      await queryClient.invalidateQueries('my-appointments');
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
    <>
      <Dialog open={open} disableBackdropClick fullWidth maxWidth="xs" onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">SỬA LỊCH HẸN</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                    defaultValue={{
                      value: new Date(dayjs(new Date(appointment.start_time)).hour(0).minute(0).second(0)).getTime(),
                      title: localDate(new Date(dayjs(appointment.start_time).hour(0).minute(0).second(0)).getTime()).toString(),
                    }}
                    renderInput={
                      (params) => (
                        <TextField
                          {...params}
                          label="Ngày"
                          variant="outlined"
                          error={!!errors.day}
                          helperText={errors.day ? errors.day.message : ''}
                        />
                      )
                    }
                    onChange={(_, val) => {
                      onChange(val);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
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
                    defaultValue={{
                      value: new Date(appointment.start_time) - new Date(dayjs(appointment.start_time).hour(0).minute(0).second(0)),
                      title: `${formatLocalHour(new Date(appointment.start_time))} - ${formatLocalHour(new Date(appointment.end_time))}`,
                    }}
                    renderInput={
                      (params) => (
                        <TextField
                          {...params}
                          label="Giờ"
                          variant="outlined"
                          error={!!errors.hour}
                          helperText={errors.hour ? errors.hour.message : ''}
                        />
                      )
                    }
                    onChange={(_, val) => {
                      onChange(val);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="type"
                control={control}
                render={({ onChange, ...props }) => (
                  <Autocomplete
                    {...props}
                    size="small"
                    className={classes.field}
                    options={examinationType.getValues()}
                    getOptionLabel={(option) => examinationType.getTitle(option)}
                    defaultValue={appointment.type}
                    renderInput={
                      (params) => (
                        <TextField
                          {...params}
                          label="Loại khám"
                          variant="outlined"
                          error={!!errors.type}
                          helperText={errors.type ? errors.type.message : ''}
                        />
                      )
                    }
                    onChange={(_, val) => {
                      onChange(val);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Mô tả..."
                name="description"
                size="small"
                defaultValue={appointment.description || ''}
                fullWidth
                className={classes.largeField}
                variant="outlined"
                inputRef={register}
                error={!!errors.description}
                helperText={errors.description ? errors.description.message : ''}
              />
            </Grid>
          </Grid>

          <div className={classes.buttons}>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={handleSubmit(updateAppointment)}
              disabled={isLoading}
            >
              Sửa
            </Button>

            <Button color="primary" variant="contained" className={classes.button} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tooltip title="Sửa lịch hẹn">
        <IconButton color="primary" onClick={() => setOpen(true)}>
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

UpdateAppointment.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default UpdateAppointment;

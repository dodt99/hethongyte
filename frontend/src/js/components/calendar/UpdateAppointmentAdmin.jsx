/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../helpers/axios';
import examinationType from '../../enums/examinationType';
import appointmentStatus from '../../enums/appointmentStatus';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  buttons: {
    float: 'right',
    marginTop: theme.spacing(2),
  },
}));

const UpdateAppointmentAdmin = ({ appointment }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: updateAppointment, isLoading } = useMutation(async (status) => {
    const newAppointment = await api.put(`/appointments/${appointment.id}`, {
      status,
      startTime: new Date(appointment.startDate).getTime(),
      endTime: new Date(appointment.endDate).getTime(),
      type: appointment.type,
    });
    return newAppointment;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
      await queryClient.invalidateQueries('appointments');
      await queryClient.invalidateQueries('my-appointments');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Mã lịch hẹn: APM{appointment.id}</Typography>
          <Typography>Số ĐT: {appointment.tel}</Typography>
          <Typography>Nhu cầu: {examinationType.getTitle(appointment.type)}</Typography>
          <Typography>Mô tả: {appointment.description}</Typography>
          <Typography>Trạng thái: {appointmentStatus.getTitle(appointment.status)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            className={classes.button}
            disabled={isLoading}
            onClick={() => updateAppointment(appointmentStatus.HUY_LICH)}
          >
            Hủy lịch
          </Button>

          <Button
            size="small"
            color="primary"
            variant="outlined"
            className={classes.button}
            disabled={isLoading}
            onClick={() => updateAppointment(appointmentStatus.CHON_LICH_KHAC)}
          >
            Chọn lịch khác
          </Button>

          <Button
            size="small"
            color="primary"
            variant="outlined"
            disabled={isLoading}
            onClick={() => updateAppointment(appointmentStatus.XAC_NHAN)}
          >
            Xác nhận
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

UpdateAppointmentAdmin.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default UpdateAppointmentAdmin;

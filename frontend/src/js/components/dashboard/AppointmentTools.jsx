import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../helpers/axios';
import appointmentStatus from '../../enums/appointmentStatus';
import AddExamination from './AddExamination';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  button: {
    marginLeft: theme.spacing(1),
    color: '#dc3545',
  },
}));

const UpdateAppointmentDoctor = ({ appointment }) => {
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
      await queryClient.invalidateQueries('appointment-list');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <div className={classes.root}>
      {
        [appointmentStatus.HUY_LICH, appointmentStatus.DA_KHAM].includes(appointment.status)
          ? null
          : (
            <>
              {/* <Button
                size="small"
                color="primary"
                variant="outlined"
                disabled={isLoading}
                onClick={() => updateAppointment(appointmentStatus.DA_KHAM)}
              >
                Khám
              </Button> */}

              <AddExamination appointment={appointment} />

              <Button
                size="small"
                variant="outlined"
                className={classes.button}
                disabled={isLoading}
                onClick={() => updateAppointment(appointmentStatus.HUY_LICH)}
              >
                Hủy lịch
              </Button>
            </>
          )
      }
    </div>
  );
};

UpdateAppointmentDoctor.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default UpdateAppointmentDoctor;

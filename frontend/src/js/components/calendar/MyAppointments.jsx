import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import useMyAppointments from '../../hooks/useMyAppointments';
import { formatLocalHour, localDate } from '../../helpers/date';
import appointmentStatus from '../../enums/appointmentStatus';
import UpdateAppointment from './UpdateAppointment';
import RemoveAppointment from './RemoveAppointment';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  table: {
    width: '600px',
  },
}));

const MyAppointments = () => {
  const { data, isLoading, error } = useMyAppointments();

  const classes = useStyles();

  const Header = (
    <TableHead>
      <TableRow>
        <TableCell size="medium" align="left">Mã lịch hẹn</TableCell>
        <TableCell size="medium" align="left">Ngày</TableCell>
        <TableCell size="medium" align="left">Giờ</TableCell>
        <TableCell size="medium" align="left">Trạng thái</TableCell>
        <TableCell size="medium" align="left" />
      </TableRow>
    </TableHead>
  );

  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.title}>
        Lịch khám của tôi
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table size="small" aria-label="a dense table">
          {Header}

          <TableBody>
            {isLoading && <CircularProgress />}

            {error && <span>Some thing went wrong</span>}

            {data && data.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell size="medium" align="left">{`APM${appointment.id}`}</TableCell>
                <TableCell size="medium" align="left">{localDate(appointment.start_time)}</TableCell>
                <TableCell size="medium" align="left">{`${formatLocalHour(appointment.start_time)} - ${formatLocalHour(appointment.end_time)}`}</TableCell>
                <TableCell size="medium" align="left">{appointmentStatus.getTitle(appointment.status)}</TableCell>
                <TableCell size="medium" align="left">
                  <UpdateAppointment appointment={appointment} />
                  <RemoveAppointment appointmentId={appointment.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MyAppointments;

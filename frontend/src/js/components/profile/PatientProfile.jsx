/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Typography, Table, TableContainer, TableRow, TableCell, TableBody, TableHead,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useProfile from '../../hooks/useProfile';
import gender from '../../enums/gender';
import { formatLocalHour, localDate } from '../../helpers/date';
import examinationType from '../../enums/examinationType';
import appointmentStatus from '../../enums/appointmentStatus';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
    color: '#3949ab',
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

const PatientProfile = ({ userId }) => {
  const classes = useStyles();

  const { data: user } = useProfile(userId);

  if (user) {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>Thông tin cá nhân</Typography>

            <Typography>Họ tên: {user.name}</Typography>
            <Typography>Giới tính: {gender.getTitle(user.gender)}</Typography>
            <Typography>Ngày sinh: {localDate(user.birthday)}</Typography>
            <Typography>Tuổi: {new Date().getFullYear() - new Date(user.birthday).getFullYear() + 1}</Typography>
            <Typography>Điện thoại: {user.tel}</Typography>
            <Typography>Địa chỉ: {user.address}</Typography>
            <Typography>Nghề nghiệp: {user.job}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>Sinh hiệu</Typography>

            <TableContainer component={Paper}>
              <Table size="medium" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell size="medium" align="left">Ngày</TableCell>
                    <TableCell size="medium" align="left">Nhiệt độ</TableCell>
                    <TableCell size="medium" align="left">Mạch (lần/phút)</TableCell>
                    <TableCell size="medium" align="left">Huyết áp</TableCell>
                    <TableCell size="medium" align="left">Nhịp thở</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {user.vitalSigns.map((sign) => (
                    <TableRow key={sign.id}>
                      <TableCell size="medium" align="left">{localDate(sign.created_at)}</TableCell>
                      <TableCell size="medium" align="left">{sign.body_temperature}</TableCell>
                      <TableCell size="medium" align="left">{sign.pulse_rate}</TableCell>
                      <TableCell size="medium" align="left">{sign.blood_pressure}</TableCell>
                      <TableCell size="medium" align="left">{sign.respiration_rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>Diễn tiến bệnh</Typography>

            <TableContainer component={Paper}>
              <Table size="medium" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell size="medium" align="left">Ngày</TableCell>
                    <TableCell size="medium" align="left">Nội dung</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {user.diseaseProgressions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell size="medium" align="left">{localDate(s.date)}</TableCell>
                      <TableCell size="medium" align="left">{s.content}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>Lịch sử khám</Typography>

            <TableContainer component={Paper}>
              <Table size="medium" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell size="medium" align="left">STT</TableCell>
                    <TableCell size="medium" align="left">Mã lịch hẹn</TableCell>
                    <TableCell size="medium" align="left">Ngày</TableCell>
                    <TableCell size="medium" align="left">Giờ hẹn</TableCell>
                    <TableCell size="medium" align="left">Nhu cầu</TableCell>
                    <TableCell size="medium" align="left">Mô tả</TableCell>
                    <TableCell size="medium" align="left">Trạng thái</TableCell>
                    <TableCell size="medium" align="left">Bác sĩ</TableCell>
                    <TableCell size="medium" align="left">Chẩn đoán</TableCell>
                    <TableCell size="medium" align="left">Lời khuyên</TableCell>
                    <TableCell size="medium" align="left">Tái khám</TableCell>
                    <TableCell size="medium" align="left">Ghi chú</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {user.appointments.map((appointment, index) => (
                    <TableRow key={appointment.id}>
                      <TableCell size="medium" align="left">{index + 1}</TableCell>
                      <TableCell size="medium" align="left">{`APM${appointment.id}`}</TableCell>
                      <TableCell size="medium" align="left">{localDate(appointment.start_time)}</TableCell>
                      <TableCell size="medium" align="left">{`${formatLocalHour(appointment.start_time)} - ${formatLocalHour(appointment.end_time)}`}</TableCell>
                      <TableCell size="medium" align="left">{examinationType.getTitle(appointment.type)}</TableCell>
                      <TableCell size="medium" align="left">{appointment.description}</TableCell>
                      <TableCell size="medium" align="left">{appointmentStatus.getTitle(appointment.status)}</TableCell>
                      <TableCell size="medium" align="left">{appointment.doctor ? appointment.doctor.alias_name || appointment.doctor.name : ''}</TableCell>
                      <TableCell size="medium" align="left">{appointment.prognosis}</TableCell>
                      <TableCell size="medium" align="left">{appointment.advice}</TableCell>
                      <TableCell size="medium" align="left">{appointment.re_examination}</TableCell>
                      <TableCell size="medium" align="left">{appointment.note}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return '';
};

PatientProfile.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default PatientProfile;

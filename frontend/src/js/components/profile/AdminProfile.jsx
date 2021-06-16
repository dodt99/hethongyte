/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useProfile from '../../hooks/useProfile';
import gender from '../../enums/gender';
import { localDate } from '../../helpers/date';

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

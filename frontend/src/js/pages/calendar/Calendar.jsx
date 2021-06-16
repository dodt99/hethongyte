import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import Layout from '../../components/common/Layout';
import CalendarComponent from '../../components/calendar/Calendar';
import CalendarAdmin from '../../components/calendar/CalendarAdmin';
import AddAppointment from '../../components/calendar/AddAppointment';
import MyAppointments from '../../components/calendar/MyAppointments';
import useMe from '../../hooks/useMe';
import roleEnum from '../../enums/role';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
  },
  paper: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    '& > *': {
      marginRight: theme.spacing(3),
      width: theme.spacing(18),
      height: '36px',
      display: 'flex',
      color: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  paperElement: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  choXacNhan: {
    color: '#1976d2',
  },
  chonLichKhac: {
    color: 'rgb(220, 0, 78)',
  },
  huyLich: {
    color: 'rgba(0, 0, 0, 0.18)',
  },
  daXacNhan: {
    color: 'rgb(165 199 24)',
  },
  daKham: {
    color: '#28a745',
  },
  lichCuaToi: {
    color: 'rgb(255, 193, 7)',
  },
}));

const Calendar = () => {
  const classes = useStyles();

  const { data: me } = useMe();

  return (
    <Layout title="Lịch Khám">
      {
        me && me.role === roleEnum.ADMIN
          ? (
            <div>
              <div className={classes.paper}>
                <Paper className={classes.paperElement}>
                  <FiberManualRecordIcon className={classes.choXacNhan} /> Chờ xác nhận
                </Paper>
                <Paper className={classes.paperElement}>
                  <FiberManualRecordIcon className={classes.chonLichKhac} /> Chọn lịch khác
                </Paper>
                <Paper className={classes.paperElement}>
                  <FiberManualRecordIcon className={classes.huyLich} /> Hủy lịch
                </Paper>
                <Paper className={classes.paperElement}>
                  <FiberManualRecordIcon className={classes.daXacNhan} /> Đã xác nhận
                </Paper>
                <Paper className={classes.paperElement}>
                  <FiberManualRecordIcon className={classes.daKham} /> Đã khám
                </Paper>
              </div>

              <CalendarAdmin />
            </div>
          )
          : (
            <>
              <AddAppointment />

              <div>
                <div className={classes.paper}>
                  <Paper className={classes.paperElement}>
                    <FiberManualRecordIcon className={classes.huyLich} /> Đã đặt
                  </Paper>
                  <Paper className={classes.paperElement}>
                    <FiberManualRecordIcon className={classes.lichCuaToi} /> Lịch của tôi
                  </Paper>
                </div>
              </div>

              <div className={classes.flex}>
                <CalendarComponent />
                <MyAppointments />
              </div>
            </>
          )
      }
    </Layout>
  );
};

export default Calendar;

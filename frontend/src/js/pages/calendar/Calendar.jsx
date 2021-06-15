import React from 'react';
import { makeStyles } from '@material-ui/styles';

import Layout from '../../components/common/Layout';
import CalendarComponent from '../../components/calendar/Calendar';
import CalendarAdmin from '../../components/calendar/CalendarAdmin';
import AddAppointment from '../../components/calendar/AddAppointment';
import MyAppointments from '../../components/calendar/MyAppointments';
import useMe from '../../hooks/useMe';
import roleEnum from '../../enums/role';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
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
            <div className={classes.flex}>
              <CalendarAdmin />
            </div>
          )
          : (
            <>
              <AddAppointment />

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

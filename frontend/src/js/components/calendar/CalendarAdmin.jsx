import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  // AppointmentForm,
  AppointmentTooltip,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
  ViewState,
} from '@devexpress/dx-react-scheduler';

import { formatLocalDate } from '../../helpers/date';
import useAppointments from '../../hooks/useAppointments';
import UpdateAppointmentAdmin from './UpdateAppointmentAdmin';
import appointmentStatus from '../../enums/appointmentStatus';

const styles = {
  toolbarRoot: {
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
  },
};

const ToolbarWithLoading = withStyles(styles, { name: 'Toolbar' })(
  ({ children, classes, ...restProps }) => (
    <div className={classes.toolbarRoot}>
      <Toolbar.Root {...restProps}>
        {children}
      </Toolbar.Root>
      <LinearProgress className={classes.progress} />
    </div>
  ),
);

const initialState = {
  currentDate: formatLocalDate(new Date()),
  currentViewName: 'Week',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCurrentViewName':
      return { ...state, currentViewName: action.payload };
    case 'setCurrentDate':
      return { ...state, currentDate: action.payload };
    default:
      return state;
  }
};

const mapAppointmentData = (appointment) => ({
  id: appointment.id,
  startDate: appointment.start_time,
  endDate: appointment.end_time,
  title: appointment.patient.name,
  patientId: appointment.patient.id,
  tel: appointment.patient.tel,
  status: appointment.status,
  type: appointment.type,
  description: appointment.description,
});

const getBackgroundByStatus = (status) => {
  switch (status) {
    case appointmentStatus.CHO_XAC_NHAN:
      return '#17a2b8';
    case appointmentStatus.CHON_LICH_KHAC:
      return '#6c757d';
    case appointmentStatus.HUY_LICH:
      return '#cccccc';
    case appointmentStatus.XAC_NHAN:
      return '#28a745';
    case appointmentStatus.DA_KHAM:
      return '#72e946';
    default:
      return '';
  }
};

// eslint-disable-next-line react/prop-types
const Appointment = ({ children, style, ...restProps }) => {
  const { data } = restProps;
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        // eslint-disable-next-line react/prop-types
        backgroundColor: getBackgroundByStatus(data.status),
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );
};

const Content = ({
  // eslint-disable-next-line react/prop-types
  children, appointmentData, ...restProps
}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <UpdateAppointmentAdmin appointment={appointmentData} />
  </AppointmentTooltip.Content>
);

const CalendarAdmin = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    currentViewName, currentDate,
  } = state;

  const setCurrentViewName = React.useCallback((nextViewName) => dispatch({
    type: 'setCurrentViewName', payload: nextViewName,
  }), [dispatch]);
  const setCurrentDate = React.useCallback((nextDate) => dispatch({
    type: 'setCurrentDate', payload: nextDate,
  }), [dispatch]);

  const { data: appointments, isLoading } = useAppointments();

  return (
    <Paper>
      <Scheduler
        data={appointments ? appointments.map(mapAppointmentData) : []}
        height={730}
      >
        <ViewState
          currentDate={currentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}
          onCurrentDateChange={setCurrentDate}
        />
        <DayView
          startDayHour={7.5}
          endDayHour={17.5}
        />
        <WeekView
          startDayHour={7.5}
          endDayHour={17.5}
          excludedDays={[0]}
        />
        <Appointments
          appointmentComponent={Appointment}
        />
        <Toolbar
          {...isLoading ? { rootComponent: ToolbarWithLoading } : null}
        />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip
          contentComponent={Content}
          showCloseButton
          // showOpenButton
        />
      </Scheduler>
    </Paper>
  );
};

export default CalendarAdmin;

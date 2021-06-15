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
import appointmentStatus from '../../enums/appointmentStatus';
import useMe from '../../hooks/useMe';

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

// eslint-disable-next-line react/prop-types
const Appointment = ({ children, style, ...restProps }) => {
  const { data: { patientId, meId } } = restProps;
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: patientId === meId ? '#FFC107' : '#ccc',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );
};

const Calendar = () => {
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
  const { data: me } = useMe();

  const mapAppointmentData = (appointment) => ({
    id: appointment.id,
    startDate: appointment.start_time,
    endDate: appointment.end_time,
    title: `Mã: APM${appointment.id}, ${appointmentStatus.getTitle(appointment.status)}`,
    patientId: appointment.patient.id,
    meId: me.id,
  });

  return (
    <Paper>
      <Scheduler
        data={appointments && me ? appointments.map(mapAppointmentData) : []}
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
        <AppointmentTooltip />
        {/* <AppointmentTooltip
          showOpenButton
          showCloseButton
        /> */}
        {/* <AppointmentForm readOnly /> */}
      </Scheduler>
    </Paper>
  );
};

export default Calendar;

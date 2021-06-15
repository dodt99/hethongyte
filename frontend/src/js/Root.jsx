import React, { useReducer } from 'react';
import {
  Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

import theme from '../theme';
import history from './history';
import { initialState, AppReducer } from './AppReducer';
import { AppStateContext, AppDispatchContext } from './AppContext';

import PrivateRoute from './PrivateRoute';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ErrorPage from './pages/error/ErrorPage';
import Patients from './pages/patient/Patients';
import Employees from './pages/employee/Employees';
import Positions from './pages/setting/Positions';
import Calendar from './pages/calendar/Calendar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
});

const Root = () => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const ROUTER = (
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />

          <PrivateRoute exact path="/" component={() => (<Redirect to="/calendar" />)} />
          <PrivateRoute path="/patients" component={Patients} />
          <PrivateRoute path="/employees" component={Employees} />
          <PrivateRoute path="/calendar" component={Calendar} />
          <PrivateRoute path="/setting/positions" component={Positions} />

          <Route path="*" exact component={ErrorPage} />
        </Switch>
      </div>
      <ReactQueryDevtools />
    </Router>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <AppStateContext.Provider value={state}>
              <AppDispatchContext.Provider value={{ dispatch }}>
                {ROUTER}
              </AppDispatchContext.Provider>
            </AppStateContext.Provider>
          </SnackbarProvider>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </QueryClientProvider>
  );
};

export default Root;

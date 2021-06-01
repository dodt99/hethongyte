import React from 'react';
import { makeStyles } from '@material-ui/core';
import SignInComponent from '../../components/auth/SignIn';

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100vh',
    overflow: 'auto',
    backgroundColor: theme.palette.background.dark,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(20),
  },
}));

const SignIn = () => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <SignInComponent />
      </div>
    </main>

  );
};

export default SignIn;

import React from 'react';
import { makeStyles } from '@material-ui/core';
import SignUpComponent from '../../components/auth/SignUp';

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

const SignUp = () => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <SignUpComponent />
      </div>
    </main>

  );
};

export default SignUp;

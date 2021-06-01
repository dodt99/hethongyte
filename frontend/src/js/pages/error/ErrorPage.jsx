import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Box, Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
}));

const ErrorPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState();
  const status = location.state && location.state.status ? location.state.status : 404;

  useEffect(() => {
    switch (status) {
      case 404:
        setErrorMessage('Oops, The Page you are looking for cant be found!');
        break;
      case 403:
        setErrorMessage('You don\'t have permission to access page');
        break;
      default:
        setErrorMessage('');
        break;
    }
  }, [status]);
  return (
    <Box
      className={classes.container}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h1" color="primary" className={classes.marginBottom}>
        Error: {status}
      </Typography>
      <Typography variant="h2" className={classes.marginBottom}>
        {errorMessage}
      </Typography>
      <Link to="/">Return To Homepage</Link>
    </Box>
  );
};

export default ErrorPage;

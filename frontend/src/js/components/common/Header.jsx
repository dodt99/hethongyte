import React from 'react';
import clsx from 'clsx';
import {
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { setToken } from '../../helpers/axios';
import { useAppStateContext, useAppStateDispatchContext } from '../../AppContext';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.default,
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  button: {
    color: theme.palette.background.paper,
  },
  userName: {
    marginRight: theme.spacing(2),
  },
  flex: {
    display: 'flex',
    flex: 1,
  },
  colorButton: {
    color: 'white',
  },
}));

const Header = ({ user, title }) => {
  const classes = useStyles();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { openSideBar } = useAppStateContext();
  const { dispatch } = useAppStateDispatchContext();
  const signOut = () => {
    setToken('');
    queryClient.clear();
    history.push('/sign-in');
  };

  return (
    <AppBar position="absolute" className={clsx(classes.appBar, openSideBar && classes.appBarShift)}>
      <Toolbar>
        <IconButton edge="start" onClick={() => dispatch({ type: 'openSideBar' })} className={clsx(openSideBar && classes.hide)}>
          <MenuIcon className={classes.button} />
        </IconButton>

        <Typography variant="h4">
          {title}
        </Typography>

        <div className={classes.flex} />

        <Typography variant="body1" className={classes.userName}>Hi! {user.name}</Typography>

        <Tooltip title="Sign Out">
          <IconButton onClick={() => signOut()}>
            <ExitToAppIcon className={classes.colorButton} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;

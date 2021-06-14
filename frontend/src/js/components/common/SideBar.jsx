import React from 'react';
import clsx from 'clsx';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Drawer,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AssessmentIcon from '@material-ui/icons/Assessment';
import GroupIcon from '@material-ui/icons/Group';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import SettingsIcon from '@material-ui/icons/Settings';

import { useAppStateContext, useAppStateDispatchContext } from '../../AppContext';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    height: '100vh',
    overflow: 'auto',
    whiteSpace: 'nowrap',
    width: DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  typography: {
    textTransform: 'none',
  },
}));

const TABS = [
  {
    url: '/dashboards',
    title: 'Dashboard',
    icon: <AssessmentIcon color="secondary" />,
  },
  {
    url: '/users',
    title: 'Lịch Khám',
    icon: <CalendarTodayIcon color="secondary" />,
  },
  {
    url: '/patients',
    title: 'Bệnh Nhân',
    icon: <GroupIcon color="secondary" />,
  },
  {
    url: '/employees',
    title: 'Nhân Viên',
    icon: <SupervisedUserCircleIcon color="secondary" />,
  },
  {
    url: '/setting/positions',
    title: 'Cài đặt',
    icon: <SettingsIcon color="secondary" />,
  },
];

const SideBar = () => {
  const classes = useStyles();
  const history = useHistory();

  const { openSideBar } = useAppStateContext();
  const { dispatch } = useAppStateDispatchContext();

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !openSideBar && classes.drawerPaperClose),
      }}
      open={openSideBar}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => dispatch({ type: 'closeSideBar' })}>
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />

      {TABS.map((tab) => (
        <Button
          onClick={() => history.push(tab.url)}
          classes={{ root: classes.typography }}
          key={tab.url}
        >
          <ListItem>
            <ListItemIcon>
              {tab.icon}
            </ListItemIcon>

            <ListItemText primary={tab.title} primaryTypographyProps={{ variant: 'h5' }} />
          </ListItem>
        </Button>
      ))}

    </Drawer>
  );
};

export default SideBar;

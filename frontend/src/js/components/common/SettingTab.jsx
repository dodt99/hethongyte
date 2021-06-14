import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: theme.spacing(2),
  },
  tab: {
    fontWeight: 'bold',
    color: '#434140',
  },
}));

const SettingTab = ({ currentValue }) => {
  const classes = useStyles();

  return (
    <Tabs
      value={currentValue}
      indicatorColor="primary"
      textColor="primary"
      center="true"
      variant="scrollable"
      scrollButtons="auto"
      className={classes.tabs}
    >
      <Tab
        value="positions"
        label="Positions"
        component={Link}
        to="/setting/positions"
        className={classes.tab}
      />
    </Tabs>
  );
};

SettingTab.propTypes = {
  currentValue: PropTypes.string.isRequired,
};

export default SettingTab;

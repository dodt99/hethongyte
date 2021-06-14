import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  filter: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const FilterPatient = () => {
  const classes = useStyles();

  return (
    <div className={classes.filter}>adf</div>
  );
};

export default FilterPatient;

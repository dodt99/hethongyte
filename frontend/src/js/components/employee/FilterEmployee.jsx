import React from 'react';
import { Button, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Controller } from 'react-hook-form';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import debounce from 'lodash.debounce';

import genderEnum from '../../enums/gender';

const useStyles = makeStyles((theme) => ({
  filter: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formField: {
    width: '10%',
    minWidth: '160px',
    background: 'white',
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  largeField: {
    width: '14%',
    minWidth: '220px',
  },
  resetButton: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

const FilterPatient = ({
  register, control, resetFilter, setKeyword,
}) => {
  const classes = useStyles();

  const handleSetKeyword = debounce((val) => {
    setKeyword(val);
  }, 500);

  return (
    <div className={classes.filter}>
      <TextField
        label="Tìm kiếm..."
        name="keyword"
        inputRef={register}
        defaultValue={null}
        size="small"
        variant="outlined"
        className={clsx(classes.formField, classes.largeField)}
        onChange={(e) => handleSetKeyword(e.target.value)}
      />

      <Controller
        name="gender"
        defaultValue={null}
        control={control}
        render={({ onChange, ...props }) => (
          <Autocomplete
            {...props}
            size="small"
            className={classes.formField}
            options={genderEnum.getValues()}
            getOptionLabel={(option) => genderEnum.getTitle(option)}
            renderInput={
              (params) => <TextField {...params} label="Giới tính" variant="outlined" />
            }
            onChange={(_, val) => {
              onChange(val);
            }}
          />
        )}
      />

      <Button
        className={classes.resetButton}
        variant="contained"
        color="secondary"
        startIcon={<RotateLeftIcon />}
        onClick={resetFilter}
      >
        Reset
      </Button>
    </div>
  );
};

FilterPatient.propTypes = {
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  resetFilter: PropTypes.func.isRequired,
  setKeyword: PropTypes.func.isRequired,
};

export default FilterPatient;

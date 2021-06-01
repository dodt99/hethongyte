import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  DialogTitle, Dialog, DialogContent, TextField, Button, Box, Tooltip, IconButton, Grid,
  FormHelperText, InputLabel, Select, MenuItem, FormGroup, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { yupResolver } from '@hookform/resolvers';
import { useSnackbar } from 'notistack';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../helpers/axios';
import patientSchema from '../../validators/patient';
import genderEnum from '../../enums/gender';
import { formatLocalDate } from '../../helpers/date';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const UpdatePatient = ({ patient }) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    watch,
    errors,
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(patientSchema),
    mode: 'onSubmit',
  });

  const {
    name,
    gender,
    birthday,
    tel,
    address,
    note,
  } = watch();

  const { mutate: updatePatient, isLoading } = useMutation(async () => {
    const responseData = await api.put(`/patients/${patient.id}`, {
      name,
      gender,
      birthday: (birthday && formatLocalDate(birthday)) || null,
      tel: tel.trim() || null,
      address: address.trim() || null,
      note: note.trim() || null,
    });
    return responseData;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Update patient successfully', { variant: 'success' });
      await queryClient.invalidateQueries('patients');
      setOpen(false);
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Dialog open={open} disableBackdropClick fullWidth onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">UPDATE PATIENT</DialogTitle>
        <DialogContent>
          <FormGroup>
            <div className={classes.root}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    defaultValue={patient.name}
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={!!errors.gender}
                  >
                    <InputLabel>Gender</InputLabel>
                    <Controller
                      as={(
                        <Select label="Gender">
                          {genderEnum.toArray().map((s) => (
                            <MenuItem key={s.value} value={s.value}>
                              {genderEnum.getTitle(s.value)}
                            </MenuItem>
                          ))}
                        </Select>
                    )}
                      name="gender"
                      control={control}
                      defaultValue={patient.gender}
                    />
                    <FormHelperText>{errors.gender ? errors.gender.message : ''}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <KeyboardDatePicker
                        {...props}
                        inputVariant="outlined"
                        label="Birthday"
                        placeholder="dd-mm-yyyy"
                        name="birthday"
                        autoOk
                        format="DD-MM-YYYY"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.birthday}
                        helperText={errors.birthday ? errors.birthday.message : ''}
                        onChange={(e) => onChange(e || null)}
                      />
                    )}
                    name="birthday"
                    control={control}
                    defaultValue={patient.birthday}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Telephone"
                    name="tel"
                    defaultValue={patient.tel}
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.tel}
                    helperText={errors.tel ? errors.tel.message : ''}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    defaultValue={patient.address}
                    name="address"
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.address}
                    helperText={errors.address ? errors.address.message : ''}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Note"
                    name="note"
                    defaultValue={patient.note}
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.note}
                    helperText={errors.note ? errors.note.message : ''}
                  />
                </Grid>
              </Grid>
            </div>

            <Box justifyContent="flex-end" display="flex">
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={handleSubmit(updatePatient)}
                disabled={isLoading}
              >
                Update
              </Button>

              <Button color="primary" variant="contained" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Box>
          </FormGroup>
        </DialogContent>
      </Dialog>

      <Tooltip title="Update Patient">
        <IconButton color="primary" onClick={() => setOpen(true)}>
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

UpdatePatient.propTypes = {
  patient: PropTypes.object.isRequired,
};

export default UpdatePatient;

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import {
  DialogTitle, Dialog, DialogContent, TextField, Button, FormHelperText,
  FormControl, InputLabel, Select, MenuItem, Box, FormGroup, IconButton, Grid,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { yupResolver } from '@hookform/resolvers';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { KeyboardDatePicker } from '@material-ui/pickers';

import patientSchema from '../../validators/patient';
import genderEnum from '../../enums/gender';
import { api } from '../../helpers/axios';
import { formatLocalDate } from '../../helpers/date';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
}));

const AddPatient = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(patientSchema),
    mode: 'onChange',
  });

  const {
    name,
    gender,
    birthday,
    tel,
    address,
    note,
  } = watch();

  const { mutate: addPatient, isLoading } = useMutation(async () => {
    const user = await api.post('/patients', {
      name,
      gender,
      birthday: (birthday && formatLocalDate(birthday)) || null,
      tel: tel.trim() || null,
      address: address.trim() || null,
      note: note.trim() || null,
    });
    return user;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Add patient successfully', { variant: 'success' });
      setOpen(false);
      await queryClient.invalidateQueries('patients');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth disableBackdropClick onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">
          ADD NEW PATIENT
          <IconButton className={classes.closeButton} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <div className={classes.root}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
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
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Telephone"
                    name="tel"
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
                onClick={handleSubmit(addPatient)}
                disabled={isLoading}
              >
                Add
              </Button>

              <Button color="primary" variant="contained" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Box>
          </FormGroup>
        </DialogContent>
      </Dialog>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add
      </Button>
    </>
  );
};

export default AddPatient;

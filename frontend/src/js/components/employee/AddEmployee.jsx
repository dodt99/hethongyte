import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import {
  DialogTitle, Dialog, DialogContent, TextField, Button, FormHelperText,
  FormControl, InputLabel, Select, MenuItem, Box, FormGroup, IconButton, Grid,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { yupResolver } from '@hookform/resolvers';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { KeyboardDatePicker } from '@material-ui/pickers';

import employeeSchema from '../../validators/employee';
import genderEnum from '../../enums/gender';
import { api } from '../../helpers/axios';
import { formatLocalDate } from '../../helpers/date';
import usePositions from '../../hooks/usePositions';

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

const AddEmployee = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const { data: positions } = usePositions();

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(employeeSchema),
    mode: 'onSubmit',
    defaultValues: {
      birthday: null,
      fromAt: null,
      toAt: null,
    },
  });

  const {
    code, name, gender, position, email, birthday, tel,
    address, qualification, note, experience, fromAt, toAt, aliasName,
  } = watch();

  const { mutate: addEmployee, isLoading } = useMutation(async () => {
    const employee = await api.post('/employees', {
      code,
      email,
      name,
      gender,
      tel: tel.trim() || null,
      birthday: (birthday && formatLocalDate(birthday)) || null,
      address: address.trim() || null,
      note: note.trim() || null,
      aliasName: aliasName || null,
      qualification: qualification || null,
      experience: experience || null,
      fromAt: (fromAt && formatLocalDate(fromAt)) || null,
      toAt: (toAt && formatLocalDate(toAt)) || null,
      positionId: position && position.id,
    });
    return employee;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Thêm nhân viên thành công', { variant: 'success' });
      setOpen(false);
      await queryClient.invalidateQueries('employees');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth disableBackdropClick onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">
          THÊM NHÂN VIÊN
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
                    label="Code"
                    name="code"
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.code}
                    helperText={errors.code ? errors.code.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Họ tên"
                    name="name"
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Bí danh "
                    name="aliasName"
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.aliasName}
                    helperText={errors.aliasName ? errors.aliasName.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={!!errors.gender}
                    defaultValue={null}
                  >
                    <InputLabel>Gender</InputLabel>
                    <Controller
                      as={(
                        <Select label="Giới tính">
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
                  <TextField
                    label="Số điện thoại"
                    name="tel"
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.tel}
                    helperText={errors.tel ? errors.tel.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="position"
                    defaultValue={null}
                    control={control}
                    render={({ onChange, ...props }) => (
                      <Autocomplete
                        {...props}
                        id="position"
                        options={positions || []}
                        getOptionLabel={(option) => option.name}
                        renderInput={
                          (params) => <TextField {...params} label="Vị trí" variant="outlined" />
                        }
                        onChange={(_, val) => {
                          onChange(val);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <KeyboardDatePicker
                        {...props}
                        inputVariant="outlined"
                        label="Ngày sinh"
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

                <Grid item xs={6}>
                  <TextField
                    label="Trình độ"
                    name="qualification"
                    defaultValue={null}
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.qualification}
                    helperText={errors.qualification ? errors.qualification.message : ''}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Kinh nghiệm"
                    name="experience"
                    defaultValue={null}
                    fullWidth
                    variant="outlined"
                    inputRef={register}
                    error={!!errors.experience}
                    helperText={errors.experience ? errors.experience.message : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <KeyboardDatePicker
                        {...props}
                        inputVariant="outlined"
                        label="Từ ngày"
                        placeholder="dd-mm-yyyy"
                        name="fromAt"
                        autoOk
                        format="DD-MM-YYYY"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.fromAt}
                        helperText={errors.fromAt ? errors.fromAt.message : ''}
                        onChange={(e) => onChange(e || null)}
                      />
                    )}
                    name="fromAt"
                    control={control}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <KeyboardDatePicker
                        {...props}
                        inputVariant="outlined"
                        label="Đến ngày"
                        placeholder="dd-mm-yyyy"
                        name="toAt"
                        autoOk
                        format="DD-MM-YYYY"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.toAt}
                        helperText={errors.toAt ? errors.toAt.message : ''}
                        onChange={(e) => onChange(e || null)}
                      />
                    )}
                    name="toAt"
                    control={control}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Địa chỉ"
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
                    label="Ghi chú"
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
                onClick={handleSubmit(addEmployee)}
                disabled={isLoading}
              >
                Thêm
              </Button>

              <Button color="primary" variant="contained" onClick={() => setOpen(false)}>
                Hủy
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
        Thêm
      </Button>
    </>
  );
};

export default AddEmployee;

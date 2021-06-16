import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Grid, Typography, FormGroup,
  Button, Box, TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { api } from '../../helpers/axios';
import examinationType from '../../enums/examinationType';
import addExaminationSchema from '../../validators/addExamination';
import { formatLocalDate } from '../../helpers/date';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: '1.1rem',
    color: '#3949ab',
  },
  paper: {
    padding: theme.spacing(3),
  },
  button: {
    marginLeft: theme.spacing(1),
    backgroundColor: '#dc3545',
  },
  buttonGroup: {
    marginTop: theme.spacing(3),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const AddExamination = ({ appointment }) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    errors,
    handleSubmit,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(addExaminationSchema),
    mode: 'onChange',
    defaultValues: {
      prognosis: null,
      advice: null,
      reExamination: null,
      note: null,
      bodyTemperature: null,
      pulseRate: null,
      bloodPressure: null,
      respirationRate: null,
      date: new Date(),
      content: null,
    },
  });

  const {
    prognosis, advice, reExamination, note, bodyTemperature,
    pulseRate, bloodPressure, respirationRate, date, content,
  } = watch();

  const { mutate: addExamination, isLoading } = useMutation(async () => {
    const examination = await api.post(`/appointments/${appointment.id}/examinations`, {
      prognosis: prognosis || null,
      advice: advice || null,
      reExamination: (reExamination && formatLocalDate(reExamination)) || null,
      note: note || null,
      bodyTemperature: bodyTemperature || null,
      pulseRate: pulseRate || null,
      bloodPressure: bloodPressure || null,
      respirationRate: respirationRate || null,
      date: (date && formatLocalDate(date)) || null,
      content: content || null,
    });
    return examination;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Thành công', { variant: 'success' });
      setOpen(false);
      await queryClient.invalidateQueries('appointment-list');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="lg" aria-labelledby="form-dialog-title" onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">
          Thông tin khám
          <IconButton className={classes.closeButton} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Typography>Họ tên: {appointment.patient.name}</Typography>
              <Typography>Yêu cầu: {examinationType.getTitle(appointment.type)}</Typography>
              <Typography>Mô tả: {appointment.description}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="h4" className={classes.title}>Chẩn đoán</Typography>

              <FormGroup>
                <TextField
                  className={classes.input}
                  label="Chẩn đoán"
                  name="prognosis"
                  // size="small"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                  error={!!errors.prognosis}
                  helperText={errors.prognosis ? errors.prognosis.message : ''}
                />

                <TextField
                  className={classes.input}
                  label="Lời khuyên"
                  name="advice"
                  // size="small"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                  error={!!errors.advice}
                  helperText={errors.advice ? errors.advice.message : ''}
                />

                <Controller
                  render={({ onChange, ...props }) => (
                    <KeyboardDatePicker
                      {...props}
                      inputVariant="outlined"
                      label="Tái khám"
                      placeholder="dd-mm-yyyy"
                      name="reExamination"
                      autoOk
                      // size="small"
                      format="DD-MM-YYYY"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className={classes.input}
                      error={!!errors.reExamination}
                      helperText={errors.reExamination ? errors.reExamination.message : ''}
                      onChange={(e) => onChange(e || null)}
                    />
                  )}
                  name="reExamination"
                  control={control}
                />

                <TextField
                  className={classes.input}
                  label="Ghi chú"
                  name="note"
                  // size="small"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                  error={!!errors.note}
                  helperText={errors.note ? errors.note.message : ''}
                />
              </FormGroup>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4" className={classes.title}>Sinh hiệu</Typography>

              <FormGroup>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      // className={classes.input}
                      label="Nhiệt độ"
                      name="bodyTemperature"
                      // size="small"
                      fullWidth
                      variant="outlined"
                      inputRef={register}
                      error={!!errors.bodyTemperature}
                      helperText={errors.bodyTemperature ? errors.bodyTemperature.message : ''}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      // className={classes.input}
                      label="Mạch (lần/phút)"
                      name="pulseRate"
                      // size="small"
                      fullWidth
                      variant="outlined"
                      inputRef={register}
                      error={!!errors.pulseRate}
                      helperText={errors.pulseRate ? errors.pulseRate.message : ''}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      // className={classes.input}
                      label="Huyết áp"
                      name="bloodPressure"
                      // size="small"
                      fullWidth
                      variant="outlined"
                      inputRef={register}
                      error={!!errors.bloodPressure}
                      helperText={errors.bloodPressure ? errors.bloodPressure.message : ''}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      // className={classes.input}
                      label="Nhịp thở"
                      name="respirationRate"
                      // size="small"
                      fullWidth
                      variant="outlined"
                      inputRef={register}
                      error={!!errors.respirationRate}
                      helperText={errors.respirationRate ? errors.respirationRate.message : ''}
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h4" className={classes.title}>Diễn tiến bệnh</Typography>

              <FormGroup>
                <Controller
                  render={({ onChange, ...props }) => (
                    <KeyboardDatePicker
                      {...props}
                      inputVariant="outlined"
                      label="Ngày"
                      placeholder="dd-mm-yyyy"
                      name="date"
                      autoOk
                      // size="small"
                      format="DD-MM-YYYY"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className={classes.input}
                      error={!!errors.date}
                      helperText={errors.date ? errors.date.message : ''}
                      onChange={(e) => onChange(e || null)}
                    />
                  )}
                  name="date"
                  control={control}
                />

                <TextField
                  className={classes.input}
                  label="Nội dung"
                  name="content"
                  // size="small"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                  error={!!errors.content}
                  helperText={errors.content ? errors.content.message : ''}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Box justifyContent="flex-end" display="flex" className={classes.buttonGroup}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit(addExamination)}
              disabled={isLoading}
            >
              Xác nhận
            </Button>

            <Button className={classes.button} color="primary" variant="contained" onClick={() => setOpen(false)}>
              Hủy
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Button
        size="small"
        color="primary"
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Khám
      </Button>
    </>
  );
};

AddExamination.propTypes = {
  appointment: PropTypes.object.isRequired,
};

export default AddExamination;

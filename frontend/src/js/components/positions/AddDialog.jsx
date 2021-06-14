import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button, Dialog, DialogTitle, DialogContent, TextField, Box, FormGroup,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import { useQueryClient, useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers';
import { useSnackbar } from 'notistack';

import positions from '../../validators/positions';
import { api } from '../../helpers/axios';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const AddDialog = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const {
    register,
    errors,
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(positions),
    mode: 'onChange',
  });

  const { name } = watch();

  const { mutate: addPosition, isLoading } = useMutation(async () => {
    const response = await api.post('/positions', { name });
    return response;
  });

  const onSubmit = (_, e) => {
    addPosition(_, {
      onSuccess: async () => {
        enqueueSnackbar('Success to add new position', { variant: 'success' });
        setOpen(false);
        await queryClient.invalidateQueries('positions');
        e.target.reset();
      },
      onError: (err) => {
        enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
      },
    });
  };

  return (
    <>
      <Dialog open={open} fullWidth aria-labelledby="form-dialog-title" onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">ADD NEW POSITION</DialogTitle>
        <DialogContent>
          <FormGroup>
            <TextField
              className={classes.input}
              label="Position"
              name="name"
              fullWidth
              variant="outlined"
              inputRef={register}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
            />

            <Box justifyContent="flex-end" display="flex">
              <Button
                color="primary"
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                className={classes.button}
                disabled={isLoading}
              >
                Add
              </Button>

              <Button
                color="primary"
                variant="contained"
                onClick={() => setOpen(false)}
              >
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

export default AddDialog;

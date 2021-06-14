import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog, DialogTitle, DialogContent, Button, Box, TextField,
  Tooltip, IconButton, FormGroup,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import PropTypes from 'prop-types';
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

const UpdateDialog = ({ position }) => {
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

  const { mutate: updatePosition, isLoading } = useMutation(async () => {
    const response = await api.put(`/positions/${position.id}`, { name });
    return response;
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('positions');
      enqueueSnackbar('Update position successfully', { variant: 'success' });
      setOpen(false);
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  const onSubmit = () => {
    updatePosition();
  };

  return (
    <>
      <Dialog open={open} fullWidth aria-labelledby="form-dialog-title" onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">UPDATE POSITION</DialogTitle>

        <DialogContent>
          <FormGroup>
            <TextField
              className={classes.input}
              label="Position"
              name="name"
              fullWidth
              variant="outlined"
              inputRef={register}
              defaultValue={position.name}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
            />

            <Box justifyContent="flex-end" display="flex">
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                className={classes.button}
                disabled={isLoading}
              >
                Update
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

      <Tooltip title="Update Position">
        <IconButton aria-label="update" color="primary" onClick={() => setOpen(true)}>
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

UpdateDialog.propTypes = {
  position: PropTypes.object.isRequired,
};

export default UpdateDialog;

import React, { useState } from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';

import ConfirmDialog from '../common/ConfirmDialog';
import { api } from '../../helpers/axios';

const RemoveAppointment = ({ appointmentId }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: removeAppointment, isLoading } = useMutation(async () => {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Xóa lịch khám thành công', { variant: 'success' });
      await queryClient.invalidateQueries('appointments');
      await queryClient.invalidateQueries('my-appointments');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <>
      <ConfirmDialog
        title="Xóa Lịch Khám "
        content="Bạn có chắn chắn muốn xóa lịch khám này không?"
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        onConfirm={removeAppointment}
        acceptType="Xóa"
      />

      <Tooltip title="Xóa lịch khám">
        <IconButton
          aria-label="remove"
          disabled={isLoading}
          color="primary"
          onClick={() => setOpenConfirm(true)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

RemoveAppointment.propTypes = {
  appointmentId: PropTypes.number.isRequired,
};

export default RemoveAppointment;

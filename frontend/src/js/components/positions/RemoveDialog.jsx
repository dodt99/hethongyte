import React, { useState } from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';

import ConfirmDialog from '../common/ConfirmDialog';
import { api } from '../../helpers/axios';

const RemoveDialog = ({ positionId }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleAcceptConfirmClose = () => setOpenConfirm(false);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: removePosition, isLoading } = useMutation(async () => {
    const response = await api.delete(`positions/${positionId}`);
    return response;
  }, {
    onSuccess: async () => {
      enqueueSnackbar('Remove position successfully', { variant: 'success' });
      await queryClient.invalidateQueries('positions');
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data && err.response.data.message, { variant: 'error' });
    },
  });

  return (
    <>
      <ConfirmDialog
        title="Remove Position"
        content="Are you sure to remove this position?"
        open={openConfirm}
        handleClose={handleAcceptConfirmClose}
        onConfirm={() => removePosition()}
        acceptType="Remove"
      />

      <Tooltip title="Remove Position">
        <IconButton aria-label="remove" disabled={isLoading} color="primary" onClick={() => setOpenConfirm(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

RemoveDialog.propTypes = {
  positionId: PropTypes.number.isRequired,
};

export default RemoveDialog;

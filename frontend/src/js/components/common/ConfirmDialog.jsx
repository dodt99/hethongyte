import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';

const ConfirmDialog = ({
  title, content, open, handleClose, onConfirm, acceptType,
}) => (
  <Dialog
    open={open}
    onClose={() => handleClose()}
    aria-labelledby="confirm-dialog"
    fullWidth
    maxWidth="sm"
  >
    <DialogTitle id="confirm-dialog">{title}</DialogTitle>

    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        {content}
      </DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button
        onClick={() => {
          handleClose();
          onConfirm();
        }}
        color="secondary"
      >
        {acceptType}
      </Button>

      <Button
        onClick={() => handleClose()}
        color="inherit"
      >
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  acceptType: PropTypes.string.isRequired,
};

export default ConfirmDialog;

import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useState } from 'react';

const InviteMeeting = (props) => {
  const [inputValue, setInputValue] = useState("")

  function handleInputChange(e) {
    setInputValue(e.target.value)
  }

  const handleCancel = () => {
    props.onCancel()
  };

  const handleOK = () => {
    props.onOK(inputValue)
  };

  return (
    <div>
      <Dialog open={true} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Send Meeting Invitation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send a meeting invitation message to this channel.
          </DialogContentText>
          <TextField
            // autoFocus
            margin="dense"
            label="Let's start meeting."
            type="text"
            fullWidth
            value={inputValue}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOK} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteMeeting
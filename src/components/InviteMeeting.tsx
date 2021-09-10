import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useState } from 'react'
import { Box } from '@material-ui/core'

interface Props {
  onOK: (arg0: string) => void
  onCancel: () => void
}

const InviteMeeting = (props: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("Let's start meeting.")

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setInputValue(e.target.value)
  }

  const handleCancel = () => {
    props.onCancel()
  }

  const handleOK = () => {
    props.onOK(inputValue)
  }

  return (
    <Box>
      <Dialog open={true} onClose={handleCancel} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Send Meeting Invitation</DialogTitle>
        <DialogContent>
          <DialogContentText>Send a meeting invitation message to this channel.</DialogContentText>
          <TextField
            defaultValue={inputValue}
            autoFocus
            margin='dense'
            label='Message'
            type='text'
            fullWidth
            value={inputValue}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant='contained'>
            Cancel
          </Button>
          <Button onClick={handleOK} variant='contained' color='primary'>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default InviteMeeting

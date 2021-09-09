import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Button, Snackbar, Box, SnackbarCloseReason } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';
import useCurrentUser from '../hooks/useCurrentUser';

import { firebaseApp } from '../firebaseConfig';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
const db = getFirestore(firebaseApp);

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  textfield: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
  },
}));

const AddChannel = (): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const user = useCurrentUser();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setInputValue(e.target.value);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.keyCode === 13) {
      addChannel(inputValue).catch(console.log);
      setInputValue('');
    }
  }

  const addChannel = async (channel: string) => {
    if (channel.length === 0) return;

    const newChannel = {
      owner: user?.uid,
      name: channel,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'channels'), newChannel);

    setInputValue('');
    setOpen(true);
    console.log('Document successfully written!');
  };

  const handleClose = (event: React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={inputValue}
        label='Add Channel'
        variant='outlined'
        className={classes.textfield}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: (
            <Button variant='contained' color='primary' onClick={() => addChannel(inputValue)}>
              Add
            </Button>
          ),
        }}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity='success'>You have successfully created a channel.</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddChannel;

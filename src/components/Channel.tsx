import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useParams, RouteComponentProps } from 'react-router-dom'

import firebase, {db} from '../firebase'
import useCurrentUser from '../hooks/useCurrentUser';
import Timeline from './Timeline'
import { Button, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  textfield: {
    backgroundColor: theme.palette.background.paper
  }
}));

interface ParamTypes {
  channel: string
}

const Channel = () => {
  const { channel } = useParams<ParamTypes>()
  // console.log(channel)

  const [inputValue, setInputValue] = useState("")
  const classes = useStyles();
  const user = useCurrentUser()

  function handleKeyPress(e: React.KeyboardEvent) {
    if(e.keyCode === 13){
      sendMessage(channel, user, inputValue)
      setInputValue("")
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // console.log(e)
    setInputValue(e.target.value)
  }

  const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    sendMessage(channel, user, inputValue)
    setInputValue("")
}

  const sendMessage = (channel: string, user: any, message: string) => {
    if (message.length === 0) return
    // Add a new document in collection "cities"
    db.collection("channels").doc(channel).collection("posts").add({
      owner: user.uid,
      from: user.displayName,
      body: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      metadata: {}
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }

  return (
    <Box>
      <Timeline channel={channel}/>
      <TextField fullWidth
        value={inputValue}
        label="Message"
        variant="outlined"
        className={classes.textfield}
        onKeyDown={handleKeyPress}
        onChange={(e) => handleInputChange(e)}
        InputProps={{endAdornment: <Button variant="contained" color="primary" onClick={(e) => handleSendMessage(e)}>
        Send
        </Button>}}
         />
    </Box>
  )
}

export default Channel;

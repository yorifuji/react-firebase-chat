import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useParams } from 'react-router-dom'

import firebase, {db} from '../firebase'
import useCurrentUser from '../hooks/useCurrentUser';
import Timeline from './Timeline'
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  textfield: {
    backgroundColor: theme.palette.background.paper
  }
}));

const Channel = () => {
  let { channel } = useParams();
  // console.log(channel)

  const [inputValue, setInputValue] = useState("")
  const classes = useStyles();
  const user = useCurrentUser()
  
  function handleKeyPress(e) {
    if(e.keyCode === 13){
      sendMessage(channel, user, inputValue)
      setInputValue("")
    }
  }

  function handleInputChange(e) {
    // console.log(e)
    setInputValue(e.target.value)
  }

  const handleSendMessage = (e) => {
    sendMessage(channel, user, inputValue)
    setInputValue("")
}

  const sendMessage = (channel, user, message) => {
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
    <div>
      <Timeline channel={channel}/>
      <TextField fullWidth 
        value={inputValue}
        label="Message"
        variant="outlined"
        className={classes.textfield}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        InputProps={{endAdornment: <Button variant="contained" color="primary" onClick={() => handleSendMessage()}>
        Send
        </Button>}}
         />
    </div>
  )
}

export default Channel;

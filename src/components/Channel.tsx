import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { useParams } from 'react-router-dom'

import useCurrentUser from '../hooks/useCurrentUser'
import Timeline from './Timeline'
import { Button, Box } from '@material-ui/core'

import { firebaseApp } from '../firebaseConfig'
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { User } from 'firebase/auth'
const db = getFirestore(firebaseApp)

const useStyles = makeStyles((theme) => ({
  textfield: {
    backgroundColor: theme.palette.background.paper,
  },
}))

interface ParamTypes {
  channel: string
}

const Channel = (): JSX.Element => {
  const { channel } = useParams<ParamTypes>()
  // console.log(channel)

  const [inputValue, setInputValue] = useState('')
  const classes = useStyles()
  const user = useCurrentUser()

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.keyCode === 13) {
      sendMessage(channel, user, inputValue).catch(console.log)
      setInputValue('')
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // console.log(e)
    setInputValue(e.target.value)
  }

  const handleSendMessage = () => {
    sendMessage(channel, user, inputValue).catch(console.log)
    setInputValue('')
  }

  const sendMessage = async (channel: string, user: User | null, message: string) => {
    if (message.length === 0) return
    if (user == null) return

    const post = {
      owner: user.uid,
      from: user.displayName,
      body: message,
      createdAt: serverTimestamp(),
      metadata: {},
    }
    await addDoc(collection(db, 'channels', channel, 'posts'), post)
  }

  return (
    <Box>
      <Timeline channel={channel} />
      <TextField
        fullWidth
        value={inputValue}
        label='Message'
        variant='outlined'
        className={classes.textfield}
        onKeyDown={handleKeyPress}
        onChange={(e) => handleInputChange(e)}
        InputProps={{
          endAdornment: (
            <Button variant='contained' color='primary' onClick={() => handleSendMessage()}>
              Send
            </Button>
          ),
        }}
      />
    </Box>
  )
}

export default Channel

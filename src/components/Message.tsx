import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { orange } from '@material-ui/core/colors'
import {
  CardActions,
  Button,
  Grow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from '@material-ui/core'
import { Emoji, EmojiData } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import './Message.css'
import useCurrentUser from '../hooks/useCurrentUser'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import { firebaseApp } from '../firebaseConfig'
import { getFirestore, doc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
const db = getFirestore(firebaseApp)

const useStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: orange[500],
  },
  card: {
    marginBottom: 10,
  },
  cardcontent: {
    paddingTop: 0,
  },
  labelSmall: {
    paddingLeft: 4,
  },
}))

type Props = {
  channel: string
  message: Message
  reactions: Reaction[]
}

const Message = (props: Props): JSX.Element => {
  const { channel, message, reactions } = props
  const classes = useStyles()
  const [showPicker, setShowPicker] = useState(false)
  const [summarizedReaction, setSummarizedReaction] = useState<ReactionUI[]>([])
  const user = useCurrentUser()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleCardActionMeeting = (metadata: Meeting) => {
    window.open(metadata.meeting.url, '_blank', 'noopener,noreferrer')
  }

  const handleClickNewChip = () => {
    setShowPicker(!showPicker)
  }

  const firestore_add_reaction = async (emoji: string) => {
    const data = {
      uid: user?.uid,
      channel: channel,
      post: message.id,
      emoji: emoji,
      createdAt: serverTimestamp(),
    }
    await addDoc(collection(db, 'channels', channel, 'posts', message.id, 'reactions'), data)
  }

  const firestore_remove_reaction = async (reaction: Reaction) => {
    const ref = doc(db, `channels/${channel}/posts/${message.id}/reactions/${reaction.id}`)
    await deleteDoc(ref)
  }

  const handleSelectEmoji = (emoji: EmojiData) => {
    setShowPicker(false)
    if (emoji.id === undefined) return
    if (reactions.some((reaction) => reaction.emoji === emoji.id && reaction.uid === user?.uid)) return
    firestore_add_reaction(emoji.id).catch(console.log)
  }

  const handleClickReaction = (reactions: ReactionUI) => {
    console.log(reactions)
    const myReactions = reactions.items.filter((reaction) => reaction.uid === user?.uid)
    console.log(myReactions)
    if (myReactions.length) {
      // remove
      myReactions.forEach((reaction) => {
        firestore_remove_reaction(reaction).catch(console.log)
      })
    } else {
      // add
      firestore_add_reaction(reactions.emoji).catch(console.log)
    }
  }

  const handleClickDelete = () => {
    setOpenDeleteDialog(true)
  }

  const handleClickCanelDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleClickOkDeleteDialog = async () => {
    await deleteDoc(doc(db, 'channels', channel, 'posts', message.id))
    setOpenDeleteDialog(false)
  }

  useEffect(() => {
    const summarize: ReactionUI[] = []
    reactions.forEach((reaction) => {
      const exists = summarize.find((s) => s.emoji === reaction.emoji)
      if (exists) {
        exists.items.push(reaction)
      } else {
        summarize.push({
          emoji: reaction.emoji,
          items: [reaction],
        })
      }
    })
    setSummarizedReaction(summarize)
  }, [reactions])

  const toLocaleString = (date: Date) => {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') + ' ' + date.toLocaleTimeString()
  }

  return (
    <Box>
      <Grow in={true}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label='recipe' className={classes.avatar}>
                {message.from.slice(0, 1)}
              </Avatar>
            }
            action={
              message.owner === user?.uid && (
                <IconButton aria-label='menu' onClick={handleClickDelete}>
                  <DeleteIcon />
                </IconButton>
              )
            }
            title={message.from}
            subheader={toLocaleString(message.createdAt)}
          />
          <CardContent className={classes.cardcontent}>
            <Typography variant='body1' component='p'>
              {message.body}
            </Typography>
          </CardContent>
          {message.metadata != null && (
            <CardActions>
              <Button
                size='small'
                color='primary'
                onClick={() => {
                  handleCardActionMeeting(message.metadata as Meeting)
                }}
              >
                JOIN
              </Button>
            </CardActions>
          )}
          <CardActions>
            {summarizedReaction.map((reaction, index) => (
              <Chip
                classes={{ labelSmall: classes.labelSmall }}
                key={index}
                icon={<Emoji emoji={reaction.emoji} set='apple' size={18} />}
                size='small'
                label={reaction.items.length}
                onClick={() => handleClickReaction(reaction)}
              />
            ))}
            <Chip label='+' size='small' onClick={handleClickNewChip} />
          </CardActions>
          {showPicker && (
            <Picker
              autoFocus
              title='Pick your emoji...'
              emoji='point_up'
              set='apple'
              theme='auto'
              showSkinTones={false}
              style={{
                position: 'absolute',
                zIndex: 1,
                bottom: '20px',
                right: '20px',
              }}
              onSelect={(emoji) => handleSelectEmoji(emoji)}
            />
          )}
        </Card>
      </Grow>
      <Dialog
        open={openDeleteDialog}
        // onClose={handleClickCanelDeleteDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Are you sure you want to delete this message?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCanelDeleteDialog} variant='contained' autoFocus>
            Cancel
          </Button>
          <Button onClick={handleClickOkDeleteDialog} variant='contained' color='secondary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Message

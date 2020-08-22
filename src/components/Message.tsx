import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { orange } from '@material-ui/core/colors';
import { CardActions, Button, Grow, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@material-ui/core';
import { Emoji } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import "./Message.css"
import useCurrentUser from '../hooks/useCurrentUser';
import firebase, {db} from '../firebase'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  avatar: {
    backgroundColor: orange[500],
  },
  card: {
    marginBottom: 10
  },
  cardcontent: {
    paddingTop: 0
  },
  labelSmall: {
    paddingLeft: 4
  },
}));

type Props = {
  channel: string
  message: any
  reactions: any[]
};

const Message = (props: Props) => {
  const {channel, message, reactions} = props
  const classes = useStyles();
  const [showPicker, setShowPicker] = useState(false)
  const [summarizedReaction, setSummarizedReaction] = useState<any[]>([])
  const user = useCurrentUser()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleCardActionMeeting = (meeting: any) => {
    window.open(meeting.url, "_blank", "noopener,noreferrer")
  }

  const handleClickNewChip = () => {
    setShowPicker(!showPicker)
  }

  const firestore_add_reaction = (emoji: any) => {
    db.collection("channels").doc(channel).collection("posts").doc(message.id).collection("reactions").add({
      uid: user?.uid,
      channel: channel,
      post: message.id,
      emoji: emoji,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }

  const handleSelectEmoji = (emoji: any) => {
    firestore_add_reaction(emoji.id)
    setShowPicker(false)
  }

  const handleClickReaction = (reactions: any) => {
    console.log(reactions)
    const reactions_me = reactions.items.filter((reaction: any) => reaction.uid == user?.uid)
    console.log(reactions_me)
    if (reactions_me.length) {
      // remove
      reactions_me.forEach(async (reaction: any) => {
        const result = await db.collection("channels").doc(channel).collection("posts").doc(message.id).collection("reactions").doc(reaction.id).delete()
        console.log(result)
      })
    }
    else {
      // add
      firestore_add_reaction(reactions.emoji)
    }
  }

  const handleClickDelete = () => {
    setOpenDeleteDialog(true)
  }

  const handleClickCanelDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleClickOkDeleteDialog = () => {
    db.collection("channels").doc(channel).collection("posts").doc(message.id).delete()
    .then(function() {
      console.log("Document successfully delete!");
    })
    .catch(function(error) {
      console.error("Error delete document: ", error);
    });

    setOpenDeleteDialog(false)
  };

  useEffect(() => {
    const summarize: any[] = []
    reactions.forEach(reaction => {
      const exists = summarize.find(s => s.emoji === reaction.emoji)
      if (exists) {
        exists.items.push(reaction)
      }
      else {
        summarize.push({
          emoji : reaction.emoji,
          items : [reaction]
        })
      }
    })
    setSummarizedReaction(summarize)
  }, [reactions])

  const toLocaleString = (date: Date) => {
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
        ].join( '/' ) + ' '
        + date.toLocaleTimeString();
  }

  return (
    <Box>
    <Grow in={true}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {message.from.slice(0,1)}
            </Avatar>
          }
          action={
            message.owner === user?.uid && (
              <IconButton aria-label="menu" onClick={handleClickDelete}>
                <DeleteIcon />
              </IconButton>
            )
          }
          title={message.from}
          subheader={toLocaleString(message.createdAt)}
        />
        <CardContent className={classes.cardcontent}>
          <Typography variant="body1" component="p">
            {message.body}
          </Typography>
        </CardContent>
        {
          message.metadata?.meeting && (
            <CardActions>
              <Button size="small" color="primary" onClick={() => {
                handleCardActionMeeting(message.metadata.meeting)}}>
                JOIN
              </Button>
            </CardActions>
          )
        }
        <CardActions>
          {
            summarizedReaction.map((reaction,index) =>
              <Chip classes={{labelSmall: classes.labelSmall}}
                key={index}
                icon={<Emoji emoji={reaction.emoji} set='apple' size={18} />}
                size="small"
                label={reaction.items.length}
                onClick={() => handleClickReaction(reaction)} />
            )
          }
          <Chip
            label="+"
            size="small"
            onClick={handleClickNewChip} />
        </CardActions>
        {
          showPicker && <Picker
            autoFocus
            title='Pick your emoji...'
            emoji='point_up'
            set='apple'
            theme='auto'
            showSkinTones={false}
            style={{ position: 'absolute', zIndex: 1, bottom: '20px', right: '20px' }}
            onSelect={(emoji) => handleSelectEmoji(emoji)}/>
        }
      </Card>
    </Grow>
    <Dialog
        open={openDeleteDialog}
        // onClose={handleClickCanelDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this message?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCanelDeleteDialog} variant="contained" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleClickOkDeleteDialog} variant="contained" color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Message;

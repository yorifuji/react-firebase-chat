import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { orange } from '@material-ui/core/colors';
import { CardActions, Button, Grow, Chip } from '@material-ui/core';
import { Emoji } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import "./Message.css"
import useCurrentUser from '../hooks/useCurrentUser';
import firebase, {db} from '../firebase'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

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

const Message = (props) => {
  const {channel, message, reactions} = props
  const classes = useStyles();
  const [showPicker, setShowPicker] = useState(false)
  const [summarizedReaction, setSummarizedReaction] = useState([])
  const user = useCurrentUser()

  const handleCardActionMeeting = (meeting) => {
    window.open(meeting.url, "_blank", "noopener,noreferrer")
  }

  const handleClickNewChip = () => {
    setShowPicker(!showPicker)
  }

  const firestore_add_reaction = (emoji) => {
    db.collection("channels").doc(channel).collection("posts").doc(message.id).collection("reactions").add({
      uid: user.uid,
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

  const handleSelectEmoji = (emoji) => {
    firestore_add_reaction(emoji.id)
    setShowPicker(false)
  }

  const handleClickReaction = (reactions) => {
    console.log(reactions)
    const reactions_me = reactions.items.filter(reaction => reaction.uid == user.uid)
    console.log(reactions_me)
    if (reactions_me.length) {
      // remove
      reactions_me.forEach(async (reaction) => {
        const result = await db.collection("channels").doc(channel).collection("posts").doc(message.id).collection("reactions").doc(reaction.id).delete()
        console.log(result)
      })
    }
    else {
      // add
      firestore_add_reaction(reactions.emoji)
    }
  }

  useEffect(() => {
    const summarize = []
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

  return (
    <Grow in={true}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {message.from.slice(0,1)}
            </Avatar>
          }
          title={message.from}
          subheader={message.createdAt ? (toLocaleString(new Date(message.createdAt))) : toLocaleString(Date.now())}
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
  )
}

export default Message;

function toLocaleString( date ) {
  return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
      ].join( '/' ) + ' '
      + date.toLocaleTimeString();
}


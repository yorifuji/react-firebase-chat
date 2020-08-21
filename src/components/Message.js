import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { orange } from '@material-ui/core/colors';
import { CardActions, Button, Grow, Chip } from '@material-ui/core';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { Emoji } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import "./Message.css"

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
  const message = props.message;
  const reactions = props.reactions;
  const classes = useStyles();
  const [summarizedReaction, setSummarizedReaction] = useState([])

  const handleCardActionMeeting = (meeting) => {
    window.open(meeting.url, "_blank", "noopener,noreferrer")
  }

  const handleClickNewChip = () => {

  }

  const handleClickRemoveChip = () => {

  }

  useEffect(() => {
    console.log("reactions")
    console.log(reactions)
    const summarize = []
    reactions.forEach(reaction => {
      const exists = summarize.find(s => s.emoji === reaction.emoji)
      if (exists) {
        exists.uids.push(reaction)
      }
      else {
        summarize.push({
          "emoji" : reaction.emoji,
          "uids"  : [reaction]
        })
      }
    })
    setSummarizedReaction(summarize)
    console.log("summarize")
    console.log(summarize)
  }, [reactions])

  const metadataFooter = () => {
    return (
      message.metadata?.meeting && (
        <CardActions>
          <Button size="small" color="primary" onClick={() => {
            handleCardActionMeeting(message.metadata.meeting)}}>
            JOIN
          </Button>
        </CardActions>
      )
    )
  }

  const messageFooter = () => {
    console.log("messageFooter")
    console.log(summarizedReaction)
    const reaction_chips = summarizedReaction.map((reaction,index) =>
      <Chip classes={{labelSmall: classes.labelSmall}}
        key={index}
        icon={<Emoji emoji={reaction.emoji} set='apple' size={18} />}
        size="small"
        label={reaction.uids.length}
        onClick={handleClickRemoveChip} />
    )
    return (
      <CardActions>
        {reaction_chips}
        <Chip
        //  icon={<EmojiEmotionsIcon />}
         label="Add"
         size="small"
         onClick={handleClickNewChip} />
      </CardActions>
    )
  }

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
        { metadataFooter() }
        { messageFooter() }
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


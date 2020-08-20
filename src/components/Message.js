import React from 'react';
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
  const classes = useStyles();

  const handleCardActionMeeting = (meeting) => {
    window.open(meeting.url, "_blank", "noopener,noreferrer")
  }

  const handleClickChip = () => {

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
        {
          <CardActions>
            <Chip classes={{labelSmall: classes.labelSmall}}
              icon={<Emoji emoji='grinning' set='apple' size={18} />}
              size="small"
              label="1"
              onClick={handleClickChip} />
            <Chip classes={{labelSmall: classes.labelSmall}}
              icon={<Emoji emoji='+1' set='apple' size={18} />}
              size="small"
              label="10"
              onClick={handleClickChip} />
            <Chip
              icon={<EmojiEmotionsIcon />}
              label="Add"
              size="small"
              onClick={handleClickChip} />
          </CardActions>
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


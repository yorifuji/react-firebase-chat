import React from 'react';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { orange } from '@material-ui/core/colors';
import { CardActions, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: orange[500],
  },
  card: {
    marginBottom: 10
  },
  cardcontent: {
    paddingTop: 0
  },
}));


const Message = (props) => {
  const message = props.message;
  const classes = useStyles();

  const handleCardActionMeeting = (meeting) => {
    window.open(meeting.url, "_blank", "noopener,noreferrer")
  }

  return (
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
    </Card>
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


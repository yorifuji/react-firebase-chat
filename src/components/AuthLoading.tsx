import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import firebase from '../firebaseConfig'
// import useCurrentUser from '../hooks/useCurrentUser';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const AuthLoading = () => {
  const classes = useStyles();
  const history = useHistory()
  // const user = useCurrentUser()

  // useEffect(() => {
  //   if (user) history.push("/profile")
  // }, [user])

  useEffect(() => {
    const unsbscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) history.push("/profile")
    })
    return () => unsbscribe()
  })

  return (
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default AuthLoading

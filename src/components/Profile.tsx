import React from 'react';
import { Grid, Box, Button } from '@material-ui/core';
import firebase from '../firebase';
import useCurrentUser from '../hooks/useCurrentUser'
import { useHistory } from 'react-router-dom';

// import { makeStyles } from '@material-ui/core/styles';
// import { orange } from '@material-ui/core/colors';
// const useStyles = makeStyles((theme) => ({
//   avatar: {
//     backgroundColor: orange[500],
//     width: theme.spacing(10),
//     height: theme.spacing(10),
//   }
// }));

const Profile = () => {
  const user = useCurrentUser()
  const history = useHistory()

  const signin_google = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    history.push('/auth')
  };

  const signin_twitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider);
    history.push('/auth')
  };

  const logout = () => {
    firebase.auth().signOut();
  };

  const deleteAccount = () => {
    firebase.auth().currentUser?.delete().then().catch(console.log);
  }

  return (
    <Grid container alignItems="center" justify="center">
      {
        user ? (
          <Box>
            {/* <p>
              Profile
              <Avatar alt={user.displayName}
                src={user.photoURL}
                className={classes.avatar}
              >
                {user.displayName.slice(0,1)}
              </Avatar>
            </p> */}
            <p>
              displayName: {user.displayName}
            </p>
            <p>
              email: {user.email}
            </p>
            <p>
              uid: {user.uid}
            </p>
            <p>
              <Button variant="contained" color="primary" onClick={logout}>Logout</Button>
            </p>
            <p>
              <Button variant="contained" color="secondary" onClick={deleteAccount}>Unregist Account</Button>
            </p>
          </Box>
        ) : (
          <Box>
            <p>
              <Button variant="contained" color="primary" onClick={signin_google}>Signin via Google</Button>
            </p>
            <p>
              <Button variant="contained" color="primary" onClick={signin_twitter}>Signin via Twitter</Button>
            </p>
          </Box>
        )
      }
    </Grid>
  )
}

export default Profile;

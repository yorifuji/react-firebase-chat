import React from 'react';
import { Grid, Box, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { getAuth, GoogleAuthProvider, TwitterAuthProvider, signInWithRedirect } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig';
import useCurrentUser from '../hooks/useCurrentUser'


const auth = getAuth(firebaseApp);

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
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).then(() => {
      console.log("done")
    })
    history.push('/auth')
  };

  const signin_twitter = () => {
    const provider = new TwitterAuthProvider()
    signInWithRedirect(auth, provider).then(() => {})
    history.push('/auth')
  };

  const logout = () => {
    auth.signOut()
  };

  const deleteAccount = () => {
    auth.currentUser?.delete().then().catch(console.log);
  }

  return (
    <Grid container alignItems="center" justifyContent="center">
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

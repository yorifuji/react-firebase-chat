import React from 'react';
import { Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import firebase from '../firebase';
import useCurrentUser from '../hooks/useCurrentUser'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: orange[500],
    width: theme.spacing(10),
    height: theme.spacing(10),
  }
}));

const Profile = () => {
  const classes = useStyles()
  const user = useCurrentUser()
  const history = useHistory()

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    history.push('/auth')
  };
  
  const logout = () => {
    firebase.auth().signOut();
  };
  
  const deleteAccount = () => {
    firebase.auth().currentUser.delete().then().catch(console.log);
  }

  return (
    <Grid container alignItems="center" justify="center">
      {
        user ? (
          <div>
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
              <button onClick={logout}>Logout</button>
            </p>
            <p>
              <button onClick={deleteAccount}>Unregist Account</button>
            </p>
          </div>
        ) : (
          <button onClick={login}>Google Login</button>
        )  
      }
    </Grid>
  )
}

export default Profile;

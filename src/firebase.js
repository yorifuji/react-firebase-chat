
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAFQZlG-4wo0UwapHt4DvawBG35NJcojh0",
  authDomain: "react-firebase-1a904.firebaseapp.com",
  databaseURL: "https://react-firebase-1a904.firebaseio.com",
  projectId: "react-firebase-1a904",
  storageBucket: "react-firebase-1a904.appspot.com",
  messagingSenderId: "511194967473",
  appId: "1:511194967473:web:c07f008441e261009aa190",
  measurementId: "G-PCHDEMF2BD"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();

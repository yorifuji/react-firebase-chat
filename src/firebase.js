
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDz1OZ73Qx1_m00SVzlNqhh7cjYMHWSajk",
  authDomain: "yorifuji-react-firebase-chat-s.firebaseapp.com",
  databaseURL: "https://yorifuji-react-firebase-chat-s.firebaseio.com",
  projectId: "yorifuji-react-firebase-chat-s",
  storageBucket: "yorifuji-react-firebase-chat-s.appspot.com",
  messagingSenderId: "1064988512443",
  appId: "1:1064988512443:web:ebdead0f7d15299dd4199e",
  measurementId: "G-LF4F2KFCFC"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();


import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

// production
const firebaseConfig = {
  apiKey: "AIzaSyARmas2oqs3fEKWCTXXqhGFQiLqzXni8iY",
  authDomain: "yorifuji-react-firebase-chat.firebaseapp.com",
  databaseURL: "https://yorifuji-react-firebase-chat.firebaseio.com",
  projectId: "yorifuji-react-firebase-chat",
  storageBucket: "yorifuji-react-firebase-chat.appspot.com",
  messagingSenderId: "386795881064",
  appId: "1:386795881064:web:36b31b78ffba4b59c5b1dd",
  measurementId: "G-9HF38PVFYD"
};

/*
// staging
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
*/

firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();

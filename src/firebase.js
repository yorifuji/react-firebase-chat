
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

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

firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();

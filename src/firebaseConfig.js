import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBswItMjX0cuhf7c0IBNuKIY6LQ8dkRTEY",
  authDomain: "react-firebase-chat-demo-32d02.firebaseapp.com",
  projectId: "react-firebase-chat-demo-32d02",
  storageBucket: "react-firebase-chat-demo-32d02.appspot.com",
  messagingSenderId: "810042434665",
  appId: "1:810042434665:web:50564f4098e7c12b7f2ef8",
  measurementId: "G-6E1FRQMJKP"
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
logEvent(analytics, 'load');

export { firebaseApp }

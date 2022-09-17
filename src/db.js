import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const fireConfig = {
  apiKey: "AIzaSyAQ4qakkoxZz1JCQaJcukmbYFk9dSvPwP4",
  authDomain: "todoapp-43329.firebaseapp.com",
  databaseURL: "https://todoapp-43329-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todoapp-43329",
  storageBucket: "todoapp-43329.appspot.com",
  messagingSenderId: "321842836824",
  appId: "1:321842836824:web:d5a54e4054a255642aa12d",
  measurementId: "G-G8PLD6EQJF"
}

export const db = firebase.initializeApp(fireConfig).firestore()

const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }
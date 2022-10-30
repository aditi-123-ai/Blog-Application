import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCufVPt01LzD0lgF4oGI-a-tyZe6fTijFg",
  authDomain: "blog-1b24a.firebaseapp.com",
  projectId: "blog-1b24a",
  storageBucket: "blog-1b24a.appspot.com",
  messagingSenderId: "56462452976",
  appId: "1:56462452976:web:3c53ef31f1d9aad88dba35"
};

const Firebase = firebase.initializeApp(firebaseConfig);

  const db = Firebase.firestore();
  const auth = Firebase.auth();

  export default db;
  export {auth} 
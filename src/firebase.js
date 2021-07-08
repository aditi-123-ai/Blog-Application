import firebase from 'firebase';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwu8oP5BtJdks9qEAZ9P9kPf5U9bPCPR4",
  authDomain: "blog-application-1.firebaseapp.com",
  projectId: "blog-application-1",
  storageBucket: "blog-application-1.appspot.com",
  messagingSenderId: "132630956370",
  appId: "1:132630956370:web:8c1e9e9e631b9935ce128b"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();

  export default db;
  export {auth} 
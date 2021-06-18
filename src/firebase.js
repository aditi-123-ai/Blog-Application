import firebase from 'firebase';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrLhUMnrq05Df_5Syg5tvyWIE0mpTZHhY",
  authDomain: "blog-app-b2ee2.firebaseapp.com",
  projectId: "blog-app-b2ee2",
  storageBucket: "blog-app-b2ee2.appspot.com",
  messagingSenderId: "360905030977",
  appId: "1:360905030977:web:c09dc5c1f3b2f5d497b5c0"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();

  export default db;
  export {auth} 
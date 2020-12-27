import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCz9exoA7zwfDZixVNUKi1kFQclhFiMB3s",
    authDomain: "react-firebase-chatapp-18a28.firebaseapp.com",
    projectId: "react-firebase-chatapp-18a28",
    storageBucket: "react-firebase-chatapp-18a28.appspot.com",
    messagingSenderId: "677813799763",
    appId: "1:677813799763:web:6d2e455e081381d892efa6",
    measurementId: "G-98SGEWFW9V"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
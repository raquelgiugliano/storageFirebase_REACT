import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALA73Cyvjt_77KshVNygb8Aw4SFbGIorc",
  authDomain: "storage-bcbc2.firebaseapp.com",
  projectId: "storage-bcbc2",
  storageBucket: "storage-bcbc2.appspot.com",
  messagingSenderId: "856284894537",
  appId: "1:856284894537:web:3adc2b47b40f09fecbb698",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();

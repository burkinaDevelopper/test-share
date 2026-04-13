// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAwd2aEQpn8oNO22WqhUa7lbqvGcM7UN28",
  authDomain: "pixtop-72cbc.firebaseapp.com",
  databaseURL: "https://pixtop-72cbc-default-rtdb.firebaseio.com",
  projectId: "pixtop-72cbc",
  storageBucket: "pixtop-72cbc.firebasestorage.app",
  messagingSenderId: "955891467930",
  appId: "1:955891467930:web:61d4994a4d033021f74123"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
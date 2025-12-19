// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMLnXDyWoZ_db9m9bF7v_wtB8OSw0cWf4",
  authDomain: "chatbox-8af00.firebaseapp.com",
  projectId: "chatbox-8af00",
  storageBucket: "chatbox-8af00.firebasestorage.app",
  messagingSenderId: "949799300824",
  appId: "1:949799300824:web:31e25e6a487055e5f831ad",
  measurementId: "G-BCYV8SYWJ9",
  databaseURL: "https://chatbox-8af00-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
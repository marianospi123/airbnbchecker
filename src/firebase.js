// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB1Vunc7y7Q0wJAzuiaM0OjP0oGbL1EuF0",
  authDomain: "comisiones-y-reservas.firebaseapp.com",
  projectId: "comisiones-y-reservas",
  storageBucket: "comisiones-y-reservas.appspot.com",
  messagingSenderId: "81169424089",
  appId: "1:81169424089:web:b2696236be1bde26c328c8",
  measurementId: "G-VRNNMB02E5"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

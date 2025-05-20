// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp-pMqK1wUOOA-ea2Zv796OtIT5AAPP-8",
  authDomain: "crypto-sphere-management.firebaseapp.com",
  projectId: "crypto-sphere-management",
  storageBucket: "crypto-sphere-management.firebasestorage.app",
  messagingSenderId: "377920850377",
  appId: "1:377920850377:web:672bbc37a0ab3d2ee20018",
  measurementId: "G-VDZSGLXM84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getauth(app)

export { app, auth};
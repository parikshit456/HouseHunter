// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlryISmVWqjjIOhcFvTg7llvoSxGCIgMo",
  authDomain: "house-marketplace-app-579f9.firebaseapp.com",
  projectId: "house-marketplace-app-579f9",
  storageBucket: "house-marketplace-app-579f9.appspot.com",
  messagingSenderId: "750826405327",
  appId: "1:750826405327:web:5eeac6b49a10aeee5c66ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

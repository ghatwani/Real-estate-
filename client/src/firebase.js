// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "real-estate-app-e796a.firebaseapp.com",
  projectId: "real-estate-app-e796a",
  storageBucket: "real-estate-app-e796a.appspot.com",
  messagingSenderId: "113890082486",
  appId: "1:113890082486:web:aad1848365ce763ba83017"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


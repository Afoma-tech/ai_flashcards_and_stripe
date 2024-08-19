// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfAEUWU0jkDwMpZ1LGEjCFPi4Be0OBtzE",
  authDomain: "flashcard-saas-688e0.firebaseapp.com",
  projectId: "flashcard-saas-688e0",
  storageBucket: "flashcard-saas-688e0.appspot.com",
  messagingSenderId: "754416159009",
  appId: "1:754416159009:web:9834962df56ce6580bd660",
  measurementId: "G-L6VCVNGGET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)

export default db
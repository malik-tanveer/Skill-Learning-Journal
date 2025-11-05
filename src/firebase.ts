// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNn_rAwG1cEm5rcn9ettULqBwhnmvlj3E",
  authDomain: "skill-learning-journal.firebaseapp.com",
  projectId: "skill-learning-journal",
  storageBucket: "skill-learning-journal.firebasestorage.app",
  messagingSenderId: "107219163023",
  appId: "1:107219163023:web:8e22ccc346df0608eb9dfa",
  measurementId: "G-NVHPYK2W6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
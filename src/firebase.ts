import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// 🔹 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNn_rAwG1cEm5rcn9ettULqBwhnmvlj3E",
  authDomain: "skill-learning-journal.firebaseapp.com",
  projectId: "skill-learning-journal",
  storageBucket: "skill-learning-journal.firebasestorage.app",
  messagingSenderId: "107219163023",
  appId: "1:107219163023:web:8e22ccc346df0608eb9dfa",
  measurementId: "G-NVHPYK2W6L",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// 🔹 Social Login Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { app, analytics, auth, googleProvider, githubProvider };

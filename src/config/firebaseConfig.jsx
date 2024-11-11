import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyB4QPabPHcb5HpOlImxoi8e5ZYC6PY3uUQ",
  authDomain: "react-firebase-39c1e.firebaseapp.com",
  projectId: "react-firebase-39c1e",
  storageBucket: "react-firebase-39c1e.firebasestorage.app",
  messagingSenderId: "276813736116",
  appId: "1:276813736116:web:f6bf26466b6cb2c201cfe1",
  measurementId: "G-5LJQFJ8K7V",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, provider, db, storage };

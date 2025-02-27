import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, updateEmail, deleteUser, reauthenticateWithCredential, EmailAuthCredential } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENDER,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, addDoc, doc, setDoc, getDoc, onAuthStateChanged, signOut, updateDoc, updateEmail, updatePassword, deleteUser, deleteDoc, EmailAuthCredential, reauthenticateWithCredential, getDocs, getAuth };
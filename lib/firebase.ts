import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CHATAPP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_CHATAPP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_CHATAPP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CHATAPP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_CHATAPP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_CHATAPP_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_CHATAPP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  // analytics,
  setDoc,
  doc,
  getDoc,
  db,
  sendPasswordResetEmail,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
};
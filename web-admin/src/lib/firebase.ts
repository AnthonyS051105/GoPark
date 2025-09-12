// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCakpa67Kv3PLgxNfGvIgrNumunK6-Xexg",
  authDomain: "smartparking-7af65.firebaseapp.com",
  projectId: "smartparking-7af65",
  storageBucket: "smartparking-7af65.firebasestorage.app",
  messagingSenderId: "956536297797",
  appId: "1:956536297797:web:6f2fe5b1b19da67196862c",
  measurementId: "G-F2JCBE4CSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (conditionally for browser)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
export default app;
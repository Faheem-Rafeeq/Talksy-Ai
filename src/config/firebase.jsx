// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPdqQ4-BpK1z-Pt3nIIB_syaVYk9mLucQ",
  authDomain: "ai-model-cdba6.firebaseapp.com",
  projectId: "ai-model-cdba6",
  storageBucket: "ai-model-cdba6.firebasestorage.app",
  messagingSenderId: "191834256955",
  appId: "1:191834256955:web:111d13e06b0ce068b64e1e",
  measurementId: "G-KTG8XM21FZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services you need
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Correct way: no need to pass `app` to GoogleAuthProvider
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup };

export default app;


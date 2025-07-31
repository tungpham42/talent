import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCUZ4oTiNhbkE5yiEEQAf0xzeSypFDZ-Q",
  authDomain: "strategic-talent-acquisition.firebaseapp.com",
  projectId: "strategic-talent-acquisition",
  storageBucket: "strategic-talent-acquisition.firebasestorage.app",
  messagingSenderId: "481389779022",
  appId: "1:481389779022:web:5a2c66abe11bcb8953cb1f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

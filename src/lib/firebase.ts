import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0ggOUK-vmHs7cO5oE9o5vFcVVU-GI8FI",
  authDomain: "farid-shop-enterprise.firebaseapp.com",
  projectId: "farid-shop-enterprise",
  storageBucket: "farid-shop-enterprise.firebasestorage.app",
  messagingSenderId: "655300529182",
  appId: "1:655300529182:web:fd48662c4f943bd81db20f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

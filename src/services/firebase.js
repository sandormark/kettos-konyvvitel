
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "kettos-konyveles.firebaseapp.com",
  projectId: "kettos-konyveles",
  storageBucket: "kettos-konyveles.appspot.com",
  messagingSenderId: "128654056331",
  appId: "1:128654056331:web:825193787d805205cced8e"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth= getAuth();
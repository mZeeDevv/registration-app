import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   //Replace with your own Firebase configuration
};
  
initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
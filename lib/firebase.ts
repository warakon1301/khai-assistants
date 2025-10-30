import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEhzHo_szjR9dXwG8-X207frcVEgxuG2o",
  authDomain: "khai-assistants.firebaseapp.com",
  projectId: "khai-assistants",
  storageBucket: "khai-assistants.firebasestorage.app",
  messagingSenderId: "466096324521",
  appId: "1:466096324521:web:003fc4bf8bacc6cacf0eb8",
  measurementId: "G-S7QM805P4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;


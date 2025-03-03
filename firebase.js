// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBNDWHc4FzmMMcS9r0ITcnoslqSHtWxTQ0",
    authDomain: "finwizard-7ee87.firebaseapp.com",
    projectId: "finwizard-7ee87",
    storageBucket: "finwizard-7ee87.firebasestorage.app",
    messagingSenderId: "863775427076",
    appId: "1:863775427076:web:3240f484b65c25515a0351",
    measurementId: "G-45CYMXNGPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
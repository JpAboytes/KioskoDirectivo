import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDBY7MutAcedb_kyZeDpT--zG_IyILKyMU",
  authDomain: "hackfox-48346.firebaseapp.com",
  projectId: "hackfox-48346",
  storageBucket: "hackfox-48346.firebasestorage.app",
  messagingSenderId: "22582644008",
  appId: "1:22582644008:web:212cb4caa9b963bbab141d",
  measurementId: "G-8X9YWWHNPE"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

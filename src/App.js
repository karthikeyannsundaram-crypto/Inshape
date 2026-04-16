import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Leaf } from "lucide-react";

// --- 1. FIREBASE SETUP (The Brain) ---
const firebaseConfig = {
  apiKey: "AIzaSyAuWipJANw9Tuo6YylxoPdy7ANlb0Zpo8s",
  authDomain: "inshape-40d4a.firebaseapp.com",
  projectId: "inshape-40d4a",
  storageBucket: "inshape-40d4a.firebasestorage.app",
  messagingSenderId: "363954209815",
  appId: "1:363954209815:web:d02c713981901b53d44852",
  measurementId: "G-VQL7VGTRS1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// --- 2. MAIN APP COMPONENT (The Body) ---
export default function App() {
  const [appState, setAppState] = useState("login"); 
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfile({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        });
        setAppState("dashboard");
      } else {
        setAppState("login");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError("");
    try {
      // This is the line that triggers the popup
      const result = await signInWithPopup(auth, provider);
      console.log("Success!", result.user);
    } catch (error) {
      console.error(error);
      setAuthError(`Error: ${error.message}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      {appState === "login" ? (
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Leaf className="w-8 h-8 text-emerald-800 mr-2" />
            <h1 className="text-3xl font-serif">Inshape</h1>
          </div>
          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="bg-white border px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            {isAuthenticating ? "Connecting..." : "Continue with Google"}
          </button>
          {authError && <p className="text-red-500 mt-4 text-sm">{authError}</p>}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl">Welcome, {userProfile?.name}!</h1>
          <button onClick={() => signOut(auth)} className="mt-4 text-red-500 underline">Sign Out</button>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Leaf, Wind, Droplets, Activity, Home, Calendar, User, LogOut,
  ChevronRight, Play, CheckCircle2, ArrowRight, Flame, TrendingUp,
  Clock, ShieldCheck,
} from "lucide-react";

// --- 1. FIREBASE CONFIGURATION ---
// Replace the "dummy-key" strings with your actual keys from Firebase Console if you have them!
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY", 
  authDomain: "inshape-app.firebaseapp.com",
  projectId: "inshape-app",
  storageBucket: "inshape-app.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- 2. MAIN APP COMPONENT ---
export default function App() {
  const [appState, setAppState] = useState("login"); 
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [authError, setAuthError] = useState("");

  // Listen for Auth changes (This stops the "flash" of the login screen)
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
      if (firebaseConfig.apiKey === "YOUR_ACTUAL_API_KEY") {
        throw new Error("Firebase API Key is missing. Add it to the code!");
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUserProfile({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
      setAppState("onboarding");
    } catch (error) {
      console.error("Google Auth Error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Domain not authorized in Firebase Console.");
      } else {
        setAuthError("Login failed. Check your connection.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCompleteOnboarding = (profileData) => {
    setUserProfile((prev) => ({ ...prev, ...profileData }));
    setAppState("dashboard");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAppState("login");
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-100">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {appState === "login" && (
        <LandingPage
          onLogin={handleGoogleLogin}
          isAuthenticating={isAuthenticating}
          authError={authError}
        />
      )}
      {appState === "onboarding" && (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}
      {appState === "dashboard" && (
        <Dashboard onLogout={handleLogout} userProfile={userProfile} />
      )}
    </div>
  );
}

// --- KEEP YOUR LandingPage, Onboarding, and Dashboard components below this line ---

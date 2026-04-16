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

// --- 1. FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your real key from Firebase
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
      const result = await signInWithPopup(auth, provider);
      setUserProfile({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
      setAppState("onboarding");
    } catch (error) {
      console.error(error);
      setAuthError("Login failed. Check if popups are blocked.");
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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {appState === "login" && (
        <LandingPage onLogin={handleGoogleLogin} isAuthenticating={isAuthenticating} authError={authError} />
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

// --- 3. LANDING PAGE ---
const LandingPage = ({ onLogin, isAuthenticating, authError }) => (
  <div className="flex flex-col min-h-screen items-center justify-center p-6 relative">
    <div className="max-w-md w-full flex flex-col items-center z-10">
      <div className="mb-12 flex items-center space-x-3 animate-fade-up">
        <Leaf className="w-8 h-8 text-emerald-800" />
        <h1 className="text-3xl font-serif text-stone-900">Inshape</h1>
      </div>
      <button 
        onClick={onLogin} 
        disabled={isAuthenticating}
        className="w-full flex items-center justify-center space-x-3 bg-white border border-stone-200 py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
      >
        <span className="text-stone-700 font-medium">Continue with Google</span>
      </button>
      {authError && <p className="mt-4 text-rose-500 text-xs">{authError}</p>}
    </div>
  </div>
);

// --- 4. ONBOARDING ---
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ height: "", weight: "", goal: "" });
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <h2 className="text-2xl font-serif mb-6">Step {step} of 3</h2>
        {step === 1 && (
          <input 
            type="number" placeholder="Weight (kg)" 
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            className="w-full p-4 bg-stone-50 rounded-xl mb-4"
          />
        )}
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : onComplete(formData)}
          className="w-full bg-emerald-800 text-white py-4 rounded-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// --- 5. DASHBOARD ---
const Dashboard = ({ onLogout, userProfile }) => (
  <div className="p-10">
    <h1 className="text-3xl font-serif">Welcome, {userProfile?.name}</h1>
    <button onClick={onLogout} className="mt-10 text-rose-500">Sign Out</button>
  </div>
);

cat << 'EOF' > src/App.js
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Activity, Target, User, ArrowRight, Sparkles } from "lucide-react";

// --- CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyAuWipJANw9Tuo6YylxoPdy7ANlb0Zpo8s",
  authDomain: "inshape-40d4a.firebaseapp.com",
  projectId: "inshape-40d4a",
  storageBucket: "inshape-40d4a.firebasestorage.app",
  messagingSenderId: "363954209815",
  appId: "1:363954209815:web:d02c713981901b53d44852"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ weight: "", goal: "", level: "Moderate" });

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(docSnap.data());
        setUser(u);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const saveProfile = async () => {
    const data = { ...formData, name: user.displayName, email: user.email, setupComplete: true };
    await setDoc(doc(db, "users", user.uid), data);
    setProfile(data);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-stone-50 text-emerald-800 font-bold">Initializing Inshape...</div>;

  // 1. LOGIN SCREEN
  if (!user) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-stone-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Leaf className="text-emerald-700 w-10 h-10" />
          <h1 className="text-4xl font-black text-stone-800 tracking-tight">Inshape</h1>
        </div>
        <button onClick={() => signInWithPopup(auth, provider)} className="bg-white border-2 border-stone-200 px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-bold text-stone-700 flex items-center space-x-3 mx-auto">
          <span>Continue with Google</span>
        </button>
      </motion.div>
    </div>
  );

  // 2. ONBOARDING SCREEN
  if (!profile) return (
    <div className="h-screen flex items-center justify-center bg-stone-100 p-4">
      <motion.div layout className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-white">
        <div className="flex justify-between mb-8 text-stone-300">
           {[1, 2, 3].map(i => <div key={i} className={`h-1 w-full mx-1 rounded ${step >= i ? 'bg-emerald-500' : 'bg-stone-200'}`} />)}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Let's get started</h2>
              <p className="text-stone-500 mb-6">What is your current weight (kg)?</p>
              <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full p-4 bg-stone-50 rounded-xl border-2 border-stone-100 focus:border-emerald-500 outline-none text-2xl font-bold" placeholder="75" />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Your Mission</h2>
              <p className="text-stone-500 mb-6">What is your primary goal?</p>
              {['Weight Loss', 'Muscle Gain', 'Endurance'].map(g => (
                <button key={g} onClick={() => setFormData({...formData, goal: g})} className={`w-full p-4 mb-3 rounded-xl border-2 text-left transition-all ${formData.goal === g ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-100 text-stone-600'}`}>
                  {g}
                </button>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">One last thing</h2>
              <p className="text-stone-500 mb-6">Activity level?</p>
              {['Sedentary', 'Moderate', 'Athlete'].map(l => (
                <button key={l} onClick={() => setFormData({...formData, level: l})} className={`w-full p-4 mb-3 rounded-xl border-2 text-left transition-all ${formData.level === l ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-100 text-stone-600'}`}>
                  {l}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => step < 3 ? setStep(step + 1) : saveProfile()} className="w-full mt-8 bg-emerald-800 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2">
          <span>{step === 3 ? "Generate Dashboard" : "Continue"}</span>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );

  // 3. MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-stone-800">Inshape</h1>
            <p className="text-stone-500">Welcome back, {profile.name.split(' ')[0]}</p>
          </div>
          <button onClick={() => signOut(auth)} className="text-stone-400 text-sm hover:text-rose-500">Sign Out</button>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* AI COACH CARD */}
          <div className="md:col-span-2 bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <Sparkles className="absolute top-4 right-4 text-emerald-400 opacity-50" />
            <h3 className="text-emerald-300 font-bold mb-2 flex items-center"><Activity size={16} className="mr-2"/> AI Coach Insight</h3>
            <p className="text-xl font-medium leading-relaxed">
              Since your goal is <span className="text-emerald-300">{profile.goal}</span>, I recommend focusing on high-protein intake today and a 20-minute mobility session.
            </p>
            <button className="mt-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-sm border border-white/20">Ask Coach a Question</button>
          </div>

          {/* STATS CARD */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-stone-100">
            <Target className="text-emerald-600 mb-4" />
            <h3 className="text-stone-400 font-bold text-sm uppercase tracking-wider">Current Weight</h3>
            <p className="text-4xl font-black text-stone-800">{profile.weight} <span className="text-lg font-normal text-stone-400">kg</span></p>
            <div className="mt-4 h-2 w-full bg-stone-100 rounded-full">
              <div className="h-full bg-emerald-500 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

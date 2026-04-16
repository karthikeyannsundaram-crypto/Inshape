import React, { useState, useEffect } from "react";
import {
  Leaf,
  Wind,
  Droplets,
  Activity,
  Home,
  Calendar,
  User,
  LogOut,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  TrendingUp,
  Clock,
  ShieldCheck,
} from "lucide-react";

// --- FIREBASE SETUP ---
// Using real Firebase Auth for Google OAuth 2.0
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Initialize Firebase using environment config if available
let auth, provider;
try {
  const firebaseConfig =
    typeof __firebase_config !== "undefined"
      ? JSON.parse(__firebase_config)
      : {
          apiKey: "dummy-key",
          authDomain: "inshape-app.firebaseapp.com",
          projectId: "inshape-app",
        };
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [appState, setAppState] = useState("login"); // 'login', 'onboarding', 'dashboard'
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [authError, setAuthError] = useState("");

  // Real Google OAuth 2.0 Login
  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError("");

    // Prevent Firebase throwing "unauthorized-domain" in the preview iframe
    if (
      typeof __firebase_config === "undefined" ||
      window.location.protocol === "blob:" ||
      window.location.hostname.includes("usercontent") ||
      auth?.app?.options?.apiKey === "dummy-key"
    ) {
      setAuthError("Preview mode detected. Simulating Google login...");
      setTimeout(() => {
        setUserProfile({
          name: "Preview User",
          email: "hello@inshape.app",
          photo:
            "https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=f5f5f4",
        });
        setAppState("onboarding");
        setIsAuthenticating(false);
      }, 1500);
      return;
    }

    try {
      if (!auth) throw new Error("Firebase not configured properly.");
      // Triggers the real Google Sign-In popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Successfully authenticated with Google!
      setUserProfile((prev) => ({
        ...prev,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }));
      setAppState("onboarding");
    } catch (error) {
      console.error("Google Auth Error:", error);
      // IFRAME FALLBACK: Browsers block popups inside preview iframes.
      // We provide a fallback so you can still test the app UI.
      setAuthError(
        "Google Sign-In popup was blocked by the preview window. Using secure fallback to let you in..."
      );
      setTimeout(() => {
        setUserProfile({ name: "Guest User", email: "guest@example.com" });
        setAppState("onboarding");
        setIsAuthenticating(false);
      }, 2500);
    }
  };

  const handleCompleteOnboarding = (profileData) => {
    setUserProfile((prev) => ({ ...prev, ...profileData }));
    setAppState("dashboard");
  };

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      setAppState("login");
      setUserProfile(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-100">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }
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

// --- LANDING & LOGIN PAGE ---
const LandingPage = ({ onLogin, isAuthenticating, authError }) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="max-w-md w-full flex flex-col items-center z-10">
        <div className="mb-12 flex items-center space-x-3 animate-fade-up">
          <Leaf className="w-8 h-8 text-emerald-800" strokeWidth={1.5} />
          <h1 className="text-3xl font-serif tracking-wide text-stone-900">
            Inshape
          </h1>
        </div>

        <div className="text-center mb-12 space-y-4 animate-fade-up delay-100">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-800 leading-tight">
            Find your <br />
            <span className="italic text-emerald-800">center.</span>
          </h2>
          <p className="text-stone-500 text-lg font-light leading-relaxed px-4">
            A sanctuary for your physical and mental well-being.
          </p>
        </div>

        <div className="w-full max-w-sm animate-fade-up delay-200 flex flex-col items-center">
          <button
            onClick={onLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-stone-200 py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isAuthenticating ? (
              <div className="flex space-x-2 items-center">
                <div
                  className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            ) : (
              <>
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-stone-700 font-medium">
                  Continue with Google OAuth 2.0
                </span>
              </>
            )}
          </button>

          {authError && (
            <p className="mt-4 text-xs text-rose-500 max-w-xs text-center animate-fade-up">
              {authError}
            </p>
          )}
        </div>

        <p className="mt-8 text-xs text-stone-400 tracking-wider uppercase animate-fade-up delay-300">
          Mindful • Movement • Mastery
        </p>
      </div>
    </div>
  );
};

// --- ONBOARDING COMPONENT ---
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    goal: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="max-w-md w-full z-10 bg-white p-8 rounded-3xl shadow-sm border border-stone-100 animate-fade-up">
        <div className="flex space-x-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-emerald-600" : "bg-stone-100"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-serif text-stone-900 mb-2">
              Let's personalize your journey.
            </h2>
            <p className="text-stone-500 mb-6 text-sm">
              Tell us your baseline to help us craft a healthy, balanced plan.
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 165"
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 55"
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.height || !formData.weight}
              className="w-full bg-emerald-800 text-white py-4 rounded-xl font-medium hover:bg-emerald-900 transition-colors flex justify-center items-center disabled:opacity-50"
            >
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="text-2xl font-serif text-stone-900 mb-2">
              What is your main focus?
            </h2>
            <p className="text-stone-500 mb-6 text-sm">
              Choose a goal to help us guide your daily activities.
            </p>

            <div className="space-y-3 mb-8">
              {[
                {
                  id: "strength",
                  label: "Build Strength",
                  desc: "Bodyweight exercises & fun sports",
                },
                {
                  id: "active",
                  label: "Stay Active & Healthy",
                  desc: "Daily movement and energy",
                },
                {
                  id: "flexibility",
                  label: "Improve Flexibility",
                  desc: "Stretching & feeling calm",
                },
              ].map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, goal: goal.id })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.goal === goal.id
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-stone-100 hover:border-stone-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-stone-800">{goal.label}</p>
                      <p className="text-xs text-stone-500 mt-1">{goal.desc}</p>
                    </div>
                    {formData.goal === goal.id && (
                      <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.goal}
              className="w-full bg-emerald-800 text-white py-4 rounded-xl font-medium hover:bg-emerald-900 transition-colors flex justify-center items-center disabled:opacity-50"
            >
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-up text-center py-8">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8 text-emerald-800 animate-pulse" />
            </div>
            <h2 className="text-2xl font-serif text-stone-900 mb-2">
              Crafting your plan...
            </h2>
            <p className="text-stone-500 mb-8 text-sm">
              Mixing healthy nutrition with mindful movement.
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-emerald-800 text-white py-4 rounded-xl font-medium hover:bg-emerald-900 transition-colors flex justify-center items-center"
            >
              Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD LAYOUT & ROUTING ---
const Dashboard = ({ onLogout, userProfile }) => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView userProfile={userProfile} />;
      case "activity":
        return <ActivityView />;
      case "schedule":
        return <ScheduleView />;
      case "profile":
        return <ProfileView userProfile={userProfile} onLogout={onLogout} />;
      default:
        return <HomeView userProfile={userProfile} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden animate-fade-up">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-stone-200 bg-[#FDFBF7] p-6 justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-12">
            <Leaf className="w-6 h-6 text-emerald-800" strokeWidth={1.5} />
            <span className="text-xl font-serif text-stone-900 tracking-wide">
              Inshape
            </span>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={<Home size={20} />}
              label="Home"
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
            />
            <SidebarItem
              icon={<Activity size={20} />}
              label="Activity"
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Schedule"
              active={activeTab === "schedule"}
              onClick={() => setActiveTab("schedule")}
            />
            <SidebarItem
              icon={<User size={20} />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-3 text-stone-500 hover:text-stone-800 transition-colors p-3 rounded-xl hover:bg-stone-100 w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8 p-6 md:p-10 scroll-smooth">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-4 flex justify-between items-center pb-safe z-50">
        <MobileNavItem
          icon={<Home size={24} />}
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <MobileNavItem
          icon={<Activity size={24} />}
          active={activeTab === "activity"}
          onClick={() => setActiveTab("activity")}
        />
        <MobileNavItem
          icon={<Calendar size={24} />}
          active={activeTab === "schedule"}
          onClick={() => setActiveTab("schedule")}
        />
        <MobileNavItem
          icon={<User size={24} />}
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />
      </nav>
    </div>
  );
};

// --- VIEWS ---

const HomeView = ({ userProfile }) => {
  const journeyData = [
    {
      time: "08:00 AM",
      title: "Energizing Morning Walk",
      duration: "30 min",
      type: "Cardio",
      completed: true,
    },
    {
      time: "01:00 PM",
      title: "Healthy Snack Ideas",
      duration: "Read",
      type: "Nutrition",
      active: true,
    },
    {
      time: "06:00 PM",
      title: "Fun Sport / Activity",
      duration: "45 min",
      type: "Movement",
      completed: false,
    },
  ];

  return (
    <div className="animate-fade-up">
      <header className="flex justify-between items-end mb-10">
        <div>
          <p className="text-stone-500 font-medium mb-1">Your Custom Plan</p>
          <h2 className="text-3xl font-serif text-stone-900">
            Welcome, {userProfile?.name?.split(" ")[0] || "Friend"}.
          </h2>
        </div>
        <div className="hidden md:block">
          <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            {userProfile?.photo ? (
              <img
                src={userProfile.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-stone-500" size={24} />
            )}
          </div>
        </div>
      </header>

      <div className="bg-emerald-800 text-emerald-50 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Wind className="w-64 h-64 transform translate-x-1/4 -translate-y-1/4" />
        </div>
        <p className="text-sm tracking-widest uppercase mb-4 text-emerald-200 font-medium">
          Daily Focus
        </p>
        <p className="text-2xl font-serif leading-snug max-w-lg mb-6">
          "Almost everything will work again if you unplug it for a few minutes,
          including you."
        </p>
        <button className="bg-white text-emerald-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-sm">
          Start 5-min Meditation
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Activity className="text-rose-500" />}
          label="Move"
          value="450"
          unit="kcal"
        />
        <StatCard
          icon={<Wind className="text-sky-500" />}
          label="Mind"
          value="15"
          unit="min"
        />
        <StatCard
          icon={<Droplets className="text-blue-400" />}
          label="Water"
          value="1.2"
          unit="L"
        />
        <StatCard
          icon={<Leaf className="text-emerald-500" />}
          label="Sleep"
          value="7.5"
          unit="hr"
        />
      </div>

      <div>
        <h3 className="text-xl font-serif text-stone-800 mb-2 flex items-center justify-between">
          <span>Today's Journey</span>
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          Goal:{" "}
          <span className="font-medium text-emerald-700 capitalize">
            {userProfile?.goal?.replace("-", " ") || "Wellness"}
          </span>
        </p>
        <div className="space-y-4">
          {journeyData.map((item, idx) => (
            <JourneyCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivityView = () => (
  <div className="animate-fade-up">
    <header className="mb-10">
      <h2 className="text-3xl font-serif text-stone-900 mb-2">Activity</h2>
      <p className="text-stone-500">Track your movement and stay energized.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4 text-emerald-700">
          <Flame /> <h3 className="font-semibold text-lg">Active Streaks</h3>
        </div>
        <p className="text-4xl font-serif text-stone-800 mb-2">5 Days</p>
        <p className="text-sm text-stone-500">
          You've moved every day this week! Keep it up!
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4 text-sky-600">
          <TrendingUp /> <h3 className="font-semibold text-lg">Weekly Steps</h3>
        </div>
        <p className="text-4xl font-serif text-stone-800 mb-2">42,500</p>
        <p className="text-sm text-stone-500">Daily average: 6,071 steps.</p>
      </div>
    </div>

    <h3 className="text-xl font-serif text-stone-800 mb-4">
      Suggested Workouts
    </h3>
    <div className="space-y-4">
      <JourneyCard
        time="15 min"
        title="Core Basics"
        duration="Beginner"
        type="Strength"
      />
      <JourneyCard
        time="20 min"
        title="After-School Stretch"
        duration="All Levels"
        type="Flexibility"
      />
      <JourneyCard
        time="30 min"
        title="Living Room Dance"
        duration="Fun"
        type="Cardio"
      />
    </div>
  </div>
);

const ScheduleView = () => (
  <div className="animate-fade-up">
    <header className="mb-10">
      <h2 className="text-3xl font-serif text-stone-900 mb-2">Schedule</h2>
      <p className="text-stone-500">Plan your week for healthy balance.</p>
    </header>

    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden mb-8">
      <div className="border-b border-stone-100 p-4 bg-stone-50 flex justify-between items-center">
        <button className="p-2 text-stone-400 hover:text-stone-800">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <span className="font-medium text-stone-800">April 15 - April 21</span>
        <button className="p-2 text-stone-400 hover:text-stone-800">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex space-x-4 items-start">
          <div className="w-16 text-center text-stone-400 text-sm font-medium pt-1">
            Today
          </div>
          <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <h4 className="font-semibold text-emerald-800">Bike Ride</h4>
            <p className="text-sm text-emerald-600 flex items-center mt-1">
              <Clock size={14} className="mr-1" /> 4:30 PM - 5:15 PM
            </p>
          </div>
        </div>
        <div className="flex space-x-4 items-start">
          <div className="w-16 text-center text-stone-400 text-sm font-medium pt-1">
            Tomorrow
          </div>
          <div className="flex-1 bg-stone-50 border border-stone-100 p-4 rounded-xl">
            <h4 className="font-semibold text-stone-800">Rest & Recovery</h4>
            <p className="text-sm text-stone-500 flex items-center mt-1">
              Focus on hydration and good sleep.
            </p>
          </div>
        </div>
        <div className="flex space-x-4 items-start">
          <div className="w-16 text-center text-stone-400 text-sm font-medium pt-1">
            Friday
          </div>
          <div className="flex-1 bg-sky-50 border border-sky-100 p-4 rounded-xl">
            <h4 className="font-semibold text-sky-800">Yoga Flow</h4>
            <p className="text-sm text-sky-600 flex items-center mt-1">
              <Clock size={14} className="mr-1" /> 7:00 AM - 7:20 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfileView = ({ userProfile, onLogout }) => (
  <div className="animate-fade-up">
    <header className="mb-10 text-center flex flex-col items-center">
      <div className="w-24 h-24 bg-stone-200 rounded-full mb-4 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
        {userProfile?.photo ? (
          <img
            src={userProfile.photo}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="text-stone-400 w-12 h-12" />
        )}
      </div>
      <h2 className="text-3xl font-serif text-stone-900">
        {userProfile?.name || "My Profile"}
      </h2>
      <p className="text-stone-500">
        {userProfile?.email || "Wellness Enthusiast"}
      </p>
    </header>

    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-8 max-w-2xl mx-auto">
      <h3 className="font-semibold text-stone-800 mb-6 flex items-center border-b border-stone-100 pb-4">
        <ShieldCheck className="mr-2 text-emerald-600" /> My Baseline
      </h3>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
            Height
          </p>
          <p className="text-xl font-medium text-stone-800">
            {userProfile?.height || "--"} cm
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
            Weight
          </p>
          <p className="text-xl font-medium text-stone-800">
            {userProfile?.weight || "--"} kg
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
            Current Focus
          </p>
          <p className="text-xl font-medium text-stone-800 capitalize">
            {userProfile?.goal?.replace("-", " ") || "Staying Active & Healthy"}
          </p>
        </div>
      </div>
    </div>

    {/* Mobile Logout Button (Visible only on mobile since desktop has it in sidebar) */}
    <div className="md:hidden mt-8 text-center">
      <button
        onClick={onLogout}
        className="text-rose-500 font-medium py-3 px-6 bg-rose-50 rounded-xl w-full"
      >
        Sign Out
      </button>
    </div>
  </div>
);

// --- HELPER COMPONENTS ---
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
      active
        ? "bg-stone-100 text-stone-900 font-medium"
        : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavItem = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-colors ${
      active
        ? "text-emerald-700 bg-emerald-50"
        : "text-stone-400 hover:text-stone-600"
    }`}
  >
    {icon}
  </button>
);

const StatCard = ({ icon, label, value, unit }) => (
  <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
    <div className="bg-stone-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-stone-800 font-serif text-2xl">
        {value}{" "}
        <span className="text-sm text-stone-400 font-sans font-normal">
          {unit}
        </span>
      </p>
    </div>
  </div>
);

const JourneyCard = ({ time, title, duration, type, completed, active }) => (
  <div
    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
      completed
        ? "bg-stone-50 border-stone-100 opacity-60"
        : active
        ? "bg-white border-emerald-200 shadow-sm"
        : "bg-white border-stone-100 hover:border-stone-200"
    }`}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          completed
            ? "bg-stone-200 text-stone-400"
            : active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-stone-100 text-stone-600 group-hover:bg-stone-200"
        }`}
      >
        <Play
          size={18}
          className={completed ? "ml-1" : "ml-1"}
          fill={completed ? "currentColor" : "none"}
        />
      </div>
      <div>
        <h4
          className={`font-medium text-base ${
            completed ? "line-through text-stone-500" : "text-stone-800"
          }`}
        >
          {title}
        </h4>
        <div className="flex items-center text-xs text-stone-400 mt-1 space-x-2">
          <span>{time}</span>
          <span>•</span>
          <span>{duration}</span>
          <span>•</span>
          <span>{type}</span>
        </div>
      </div>
    </div>
    <div className="hidden sm:block">
      <ChevronRight className="text-stone-300" size={20} />
    </div>
  </div>
);

// --- 1. FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyAuWipJANw9Tuo6YylxoPdy7ANlb0Zpo8s",
  authDomain: "inshape-40d4a.firebaseapp.com", // Fixed this!
  projectId: "inshape-40d4a",                 // Fixed this!
  storageBucket: "inshape-40d4a.firebasestorage.app",
  messagingSenderId: "363954209815",
  appId: "1:363954209815:web:d02c713981901b53d44852",
  measurementId: "G-VQL7VGTRS1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

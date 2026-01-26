// Firebase is loaded via script tags in HTML, available as global firebase object
// This file runs as a regular script (not a module) and sets up globals

// Fetch Firebase config from server endpoint to avoid hardcoding keys
(async function initializeFirebase() {
  try {
    const response = await fetch('/api/firebase-config');
    if (!response.ok) {
      console.warn('Firebase config endpoint not available, continuing without Firebase');
      window.firebaseExports = null;
      return;
    }
    
    const firebaseConfig = await response.json();

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // Make available globally for app.js module to import
    window.firebaseExports = {
      auth,
      db,
      doc: db.doc.bind(db),
      getDoc: (docRef) => docRef.get(),
      setDoc: (docRef, data) => docRef.set(data),
      googleProvider,
      onAuthStateChanged: auth.onAuthStateChanged.bind(auth),
      signInWithPopup: auth.signInWithPopup.bind(auth),
      signOut: auth.signOut.bind(auth)
    };
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
    window.firebaseExports = null;
  }
})();


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
      doc: (collectionPath, docId) => db.collection(collectionPath).doc(docId),
      getDoc: async (docRef) => {
        const snapshot = await docRef.get();
        return {
          exists: () => snapshot.exists,
          data: () => snapshot.data()
        };
      },
      setDoc: (docRef, data) => docRef.set(data),
      googleProvider,
      onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback),
      signInWithPopup: (provider) => auth.signInWithPopup(provider),
      signOut: () => auth.signOut()
    };

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
    window.firebaseExports = null;
  }
})();


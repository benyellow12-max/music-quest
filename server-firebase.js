// Firebase Admin SDK for server-side operations
// Uncomment when you have a service account key
/*
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Middleware to verify Firebase ID tokens
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = { admin, db, auth, verifyToken };
*/

// For now, export a mock verifyToken that accepts all requests
module.exports = {
  verifyToken: (req, res, next) => {
    // Mock user for development
    req.user = { uid: 'demo-user', email: 'demo@example.com' };
    next();
  }
};

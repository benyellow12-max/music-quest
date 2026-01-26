# Firebase Setup Instructions

## Prerequisites
Firebase has been installed in your project. Now you need to configure it with your Firebase project credentials.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Register Your Web App
1. In your Firebase project, click the **Web** icon (`</>`) to add a web app
2. Give your app a nickname (e.g., "Music Quest")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase config object that appears

## Step 3: Update Client Configuration
1. Open `public/firebase-config.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // Replace with your actual API key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Google Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle it to **Enabled**
4. Add your support email
5. Click **Save**

## Step 5: Set Up Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your Cloud Firestore location
5. Click **Enable**

### Security Rules (Initial Setup)
In **Firestore Database** → **Rules**, use these rules for development:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: (Optional) Server-Side Firebase Admin Setup
For production, you'll want to verify tokens server-side:

1. In Firebase Console, go to **Project settings** → **Service accounts**
2. Click **Generate new private key**
3. Save the JSON file as `serviceAccountKey.json` in your project root
4. **IMPORTANT**: Add `serviceAccountKey.json` to your `.gitignore` file
5. Open `server-firebase.js` and uncomment the Admin SDK code
6. Comment out the mock implementation

## Step 7: Test Your Setup
1. Start your server: `node index.js`
2. Open the app in your browser
3. Click the **Profile** tab
4. Click **Login with Google**
5. Complete the Google sign-in flow
6. You should see your email and user ID displayed

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you replaced ALL placeholder values in `firebase-config.js`
- Check that your Firebase project has authentication enabled

### "Firebase: Error (auth/unauthorized-domain)"
- In Firebase Console → Authentication → Settings → Authorized domains
- Add your domain (e.g., `localhost` for local development)

### "Failed to mark song as listened"
- Make sure you're logged in (check the Profile tab)
- The "Mark as listened" feature requires authentication

## Current State
✅ Firebase client SDK configured  
✅ Firebase auth integrated with Profile tab  
✅ Login/logout functionality  
✅ Auth token sent with listen requests  
✅ Server middleware for token verification (mock mode)  
⏳ Needs your Firebase project credentials  
⏳ Needs per-user quest persistence in Firestore  

## Next Steps After Firebase Setup
1. Add actual Firebase credentials to `firebase-config.js`
2. Test login/logout flow
3. Migrate quest progress to be stored per-user in Firestore
4. Add music provider OAuth (Spotify, Apple Music, YouTube)
5. Implement verified listen tracking from music providers

# Security Fix: Firebase Credentials

## Issue
The repository contained hardcoded Firebase API keys in `public/firebase-config.js`, which triggered GitHub's secret scanning rules.

## Resolution
1. **Moved credentials to server-side endpoint** (`/api/firebase-config`)
2. **Environment variables** can override defaults via `.env` file
3. **Client fetches config** from server instead of hardcoding

## Setup for Production

### Option 1: Use Environment Variables (Recommended)
Create a `.env` file in the project root:
```bash
cp .env.example .env
# Edit .env with your production Firebase credentials
```

### Option 2: Use Defaults (Development Only)
The server includes fallback values for development. These are safe to use locally but should be rotated for production.

## Firebase API Key Security Note
Firebase API keys for web clients are **intended to be public** in client-side code. The key itself is not a secret—security is enforced by:
- Firebase Security Rules (Firestore, Storage, etc.)
- App Check for abuse prevention
- Authentication requirements

However, GitHub still flags them because:
1. Some services bill by API usage
2. They can be used to identify your project
3. Quota abuse is possible without proper rules

## Rotating the Key (if needed)
If you need to rotate the exposed key:
1. Go to Firebase Console → Project Settings → General
2. Under "Your apps" → Web app → "Web API Key"
3. Regenerate the key
4. Update your `.env` file or production environment variables

## What Changed
- ✅ `public/firebase-config.js` now fetches config from `/api/firebase-config`
- ✅ `index.js` serves config with environment variable overrides
- ✅ `.env.example` documents required variables
- ✅ `.gitignore` already excludes `.env` files

## Pushing to GitHub
After this fix, the repository should pass GitHub's secret scanning:
```bash
git add -A
git commit -m "Security: Move Firebase config to server endpoint"
git push origin main
```

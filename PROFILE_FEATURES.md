# Profile Features Implementation

## Overview
This implementation adds comprehensive profile management features to Music Quest, including:

1. **Profile Pictures** - Users can upload and manage their profile pictures
2. **Usernames** - Users create usernames during signup and can edit them later
3. **Account Deletion** - Users can permanently delete their accounts with confirmation

## Features

### Profile Tab
A new Profile tab has been added to the main navigation (`app/(tabs)/profile.tsx`). Users can:

- **View Profile Information**
  - Username
  - Email address
  - Total score
  - Account creation date
  - Profile picture

- **Edit Username**
  - Click the pencil icon to edit username
  - Validation prevents empty usernames (min 3 characters)
  - Usernames must be unique

- **Upload Profile Picture**
  - Change photo button to select images from device
  - Images are cropped to 1:1 aspect ratio
  - Placeholder icon shown if no picture set

- **Delete Account**
  - Located in "Danger Zone" section
  - Confirmation dialog before deletion
  - Permanently removes all user data

### Signup/Onboarding Page
A new signup page (`app/signup.tsx`) allows users to create accounts with:

- **Username Selection** (required, 3+ characters)
- **Email Address** (required, must be valid email)
- **Optional Profile Picture** - Can be skipped during signup
- **Form Validation** with helpful error messages
- **Success Confirmation** directing to home page

## API Endpoints

### GET `/api/profile`
Retrieves the current user's profile information.

**Response:**
```json
{
  "username": "string",
  "email": "string",
  "avatarUrl": "string or null",
  "totalScore": "number",
  "createdAt": "ISO timestamp"
}
```

### POST `/api/auth/signup`
Creates a new user account.

**Request:**
```json
{
  "username": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "createdAt": "ISO timestamp"
}
```

### PUT `/api/profile/username`
Updates the current user's username.

**Request:**
```json
{
  "username": "string"
}
```

**Response:**
```json
{
  "username": "string"
}
```

### POST `/api/profile/avatar`
Uploads a profile picture for the current user.

**Request:** Multipart form data with `avatar` file

**Response:**
```json
{
  "avatarUrl": "string"
}
```

### DELETE `/api/profile`
Permanently deletes the current user's account and all associated data.

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

## Database Schema

Users are stored in-memory during development. The User type includes:

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  totalScore: number;
  createdAt: string;
}
```

**Note:** For production, migrate to Firebase Firestore with proper persistence.

## Installation

1. Install the new dependency:
   ```bash
   npm install expo-image-picker@~16.1.0
   ```

2. Update your app navigation to include the profile tab (already done in `_layout.tsx`)

3. Start the server and navigate to the Profile tab to test

## Usage

### For Users

1. **First Time Setup:**
   - Navigate to signup page
   - Enter username and email
   - Optionally select profile picture
   - Account is created and ready to use

2. **Managing Profile:**
   - Click Profile tab to view profile
   - Click pencil icon to edit username
   - Click "Change Photo" to update profile picture
   - View account stats (score, email, join date)

3. **Deleting Account:**
   - Scroll to "Danger Zone" section
   - Click "Delete Account"
   - Confirm in the dialog
   - Account is permanently removed

### For Developers

The implementation uses:
- **Expo Router** for navigation
- **Expo Image Picker** for image selection
- **Express.js** backend with in-memory storage
- **React Native** components for UI

In-memory storage resets when server restarts. For production:
1. Connect to Firebase Firestore for persistent storage
2. Implement Firebase Cloud Storage for image hosting
3. Add proper authentication with Firebase Auth
4. Add rate limiting for security

## Notes

- Profile pictures are stored as URLs in production
- Username uniqueness is enforced at signup and edit
- Account deletion is permanent and cannot be undone
- The mock data includes user validation
- In-memory storage is suitable for development/testing only

## Next Steps

1. Integrate with Firebase for production
2. Add image compression before upload
3. Implement user authentication properly
4. Add profile customization (bio, social links, etc.)
5. Add account recovery/password reset
6. Add email verification

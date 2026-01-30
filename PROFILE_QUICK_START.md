# Quick Start: Profile Features

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   # or use the "Start Express Server" task in VS Code
   ```

3. **Access the app:**
   - Navigate to the Profile tab in the app
   - Or go to the Signup page to create a new account

## Key Features

### 📱 Profile Tab
Located in the main navigation, allows users to:
- View profile information (username, email, score)
- Edit username
- Upload/change profile picture
- Delete account

### 📝 Signup Page
Create new accounts at `app/signup.tsx`:
- Enter username (3+ characters)
- Enter email address
- Optionally select profile picture
- Creates account and navigates to home

### ⚙️ Backend API
Server running on `http://localhost:3000` with endpoints:
- `GET /api/profile` - Get current user
- `POST /api/auth/signup` - Create account
- `PUT /api/profile/username` - Update username
- `POST /api/profile/avatar` - Upload photo
- `DELETE /api/profile` - Delete account

## File Locations

| File | Purpose |
|------|---------|
| `app/(tabs)/profile.tsx` | Profile management UI |
| `app/signup.tsx` | Account creation UI |
| `index.js` | Backend API endpoints |
| `package.json` | Dependencies (expo-image-picker added) |
| `app/(tabs)/_layout.tsx` | Navigation with Profile tab |

## Testing

### Test Signup Flow
1. Navigate to `app/signup.tsx`
2. Enter a username and email
3. Optionally select a profile picture
4. Click "Create Account"
5. Should navigate to home

### Test Profile Management
1. Click the Profile tab
2. View profile information
3. Click pencil icon to edit username
4. Click "Change Photo" to upload picture
5. Scroll to "Danger Zone" to delete account

### Test API Directly
```bash
# Get profile
curl http://localhost:3000/api/profile

# Create account
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com"}'

# Update username
curl -X PUT http://localhost:3000/api/profile/username \
  -H "Content-Type: application/json" \
  -d '{"username":"newusername"}'

# Delete account
curl -X DELETE http://localhost:3000/api/profile
```

## Notes

- Uses in-memory storage (resets on server restart)
- Suitable for development and testing
- Production use requires Firebase integration
- Profile pictures stored as URLs (implement cloud storage for production)

## Documentation

See [PROFILE_FEATURES.md](PROFILE_FEATURES.md) for complete documentation.
See [PROFILE_IMPLEMENTATION.md](PROFILE_IMPLEMENTATION.md) for technical details.

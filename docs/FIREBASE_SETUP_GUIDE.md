# SETUP GUIDE - GoPark Admin Web dengan Firebase Integration

## 📋 Langkah-langkah Setup Lengkap

### 1. Install Dependencies
Jalankan perintah ini di terminal dari direktori `web-admin`:

```bash
npm install firebase js-cookie @types/js-cookie
```

### 2. Setup Firebase Configuration

#### A. Dapatkan Firebase Config
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Firebase yang sudah Anda buat untuk mobile app
3. Klik "Project Settings" (icon gear)
4. Scroll ke bawah ke "Your apps" section
5. Klik "Add app" dan pilih "Web" (</>) 
6. Daftarkan app dengan nama "GoPark Admin Web"
7. Copy konfigurasi Firebase yang diberikan

#### B. Update Environment Variables
Edit file `.env.local` di direktori `web-admin` dan ganti dengan config Firebase Anda:

```bash
# Firebase Configuration (Replace with your actual Firebase config values)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC... # Ganti dengan API Key Anda
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gopark-xxxxx.firebaseapp.com # Ganti dengan Auth Domain Anda
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gopark-xxxxx # Ganti dengan Project ID Anda
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gopark-xxxxx.appspot.com # Ganti dengan Storage Bucket Anda
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 # Ganti dengan Messaging Sender ID Anda
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef # Ganti dengan App ID Anda

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Setup Firebase Authentication & Firestore

#### A. Enable Authentication
1. Di Firebase Console, pergi ke "Authentication"
2. Klik "Get started" jika belum diaktifkan
3. Pergi ke tab "Sign-in method"
4. Enable "Email/Password" dan "Google" sebagai providers
5. Untuk Google provider, tambahkan domain localhost dan domain production Anda

#### B. Setup Firestore Rules
1. Pergi ke "Firestore Database" 
2. Klik "Rules" tab
3. Update rules untuk collection `admins`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Existing rules for users collection (mobile app)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // NEW: Rules for admins collection (web admin)
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Allow admins to read/write parking data
    match /parkingSpots/{spotId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    match /parkingData/{dataId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### 4. Setup Backend Integration

#### A. Update Backend Environment
Tambahkan ke file `.env` di direktori `backend`:

```bash
# Google OAuth for Web Admin
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### B. Download Service Account Key
1. Di Firebase Console, pergi ke "Project Settings"
2. Pilih tab "Service accounts"
3. Klik "Generate new private key" 
4. Download file JSON dan simpan sebagai `firebase-key.json` di direktori `backend`
5. **PENTING: Jangan commit file ini ke Git!**

### 5. Update Google OAuth Settings

#### A. Google Console Setup
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project yang sama dengan Firebase
3. Pergi ke "APIs & Services" > "Credentials"
4. Klik OAuth 2.0 Client ID yang sudah ada (atau buat baru)
5. Tambahkan authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. Tambahkan authorized redirect URIs jika diperlukan

### 6. Menjalankan Aplikasi

#### A. Start Backend
```bash
cd backend
python app.py
```

#### B. Start Web Admin (terminal baru)
```bash
cd web-admin
npm run dev
```

### 7. Testing Flow

#### A. Flow Authentication
1. Buka `http://localhost:3000` 
2. Akan redirect ke `http://localhost:3000/auth/status`
3. Klik "GET STARTED" → akan ke sign up page
4. Klik "I ALREADY HAVE AN ACCOUNT" → akan ke login page
5. Setelah login/signup berhasil → redirect ke home page
6. Data admin akan tersimpan di Firestore collection `admins`

#### B. Testing Google OAuth
1. Klik "Sign Up with Google" atau "Log In with Google"
2. Pilih akun Google
3. Akan otomatis membuat/login admin dan redirect ke home page

### 8. Structure Data di Firestore

#### Collection `admins`:
```json
{
  "displayName": "John Doe",
  "email": "john@example.com", 
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-01T00:00:00Z",
  "authProvider": "email", // atau "google"
  "emailVerified": true,
  "loginCount": 5,
  "profilePicture": "https://...", // untuk Google OAuth
  "googleId": "123456789", // untuk Google OAuth
  "password": "hashed_password" // hanya untuk email auth
}
```

### 9. Fitur yang Sudah Implemented

✅ Status page (pilih signup/login)
✅ Sign up page dengan form lengkap  
✅ Login page dengan form lengkap
✅ Google OAuth untuk signup dan login
✅ Auto redirect setelah auth berhasil
✅ Persistent login (tidak perlu login ulang)
✅ Protected routes (home page hanya untuk yang login)
✅ Logout functionality
✅ Navbar dengan info user dan tombol logout
✅ Backend endpoints khusus admin
✅ Integration dengan Firebase yang sudah ada
✅ Responsive design sesuai mockup

### 10. Troubleshooting

#### Error: Firebase config not found
- Pastikan sudah copy config Firebase dengan benar ke `.env.local`
- Restart development server setelah update `.env.local`

#### Error: Google OAuth tidak bekerja  
- Pastikan `GOOGLE_CLIENT_ID` sudah ditambahkan di backend `.env`
- Cek Google Console bahwa domain localhost sudah ditambahkan
- Pastikan Firebase Auth sudah enable Google provider

#### Error: Database connection
- Pastikan `firebase-key.json` sudah ada di direktori backend
- Cek Firebase rules sudah update untuk collection `admins`

#### Error: CORS
- Backend sudah setup CORS untuk semua origins
- Jika masih error, cek firewall/antivirus

### 11. Deployment Considerations

#### Environment Variables untuk Production:
- Update `NEXT_PUBLIC_API_URL` ke URL backend production
- Update Firebase config untuk production domain  
- Update Google OAuth authorized origins ke domain production

#### Security:
- Firebase rules sudah setup untuk security
- JWT tokens expire dalam 7 hari
- Passwords di-hash menggunakan bcrypt
- Google OAuth tokens di-verify server-side

### 12. Next Steps (Optional Enhancements)

🔄 Email verification untuk signup
🔄 Password reset functionality  
🔄 Admin role management (super admin, admin, etc.)
🔄 Audit logging untuk admin actions
🔄 Profile management page
🔄 Two-factor authentication

---

## 🎉 Selesai!

Sekarang web admin Anda sudah terintegrasi dengan Firebase yang sama dengan mobile app, dan admin bisa login/signup dengan aman menggunakan email/password atau Google OAuth.

Semua data admin tersimpan di collection `admins` yang terpisah dari collection `users` (untuk mobile app), tapi menggunakan Firebase project yang sama.

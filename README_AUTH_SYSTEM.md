# 🚗 GoPark Admin Web - Authentication System

## 📖 Overview

Sistem authentication untuk admin web GoPark yang terintegrasi dengan Firebase dan backend Flask. Sistem ini memungkinkan admin untuk login/signup menggunakan email/password atau Google OAuth, dengan data tersimpan di Firebase Firestore yang sama dengan mobile app.

## 🎯 Fitur Utama

✅ **Status Page** - Halaman pemilihan login atau signup
✅ **Sign Up Page** - Registrasi admin baru dengan email/password atau Google
✅ **Login Page** - Masuk dengan akun yang sudah ada
✅ **Google OAuth** - Integrasi dengan Google Sign-In
✅ **Protected Routes** - Halaman yang hanya bisa diakses setelah login
✅ **Persistent Login** - Tetap login setelah refresh/tutup browser
✅ **Auto Redirect** - Otomatis redirect sesuai status authentication
✅ **Logout Functionality** - Keluar dari sistem dengan aman

## 🏗️ Arsitektur

```
Frontend (Next.js) ←→ Firebase Auth ←→ Backend (Flask) ←→ Firebase Firestore
                                                    ↓
                                              Collection: admins
```

## 🚀 Cara Menjalankan

### 1. Setup Environment

Pastikan file `.env.local` sudah dikonfigurasi dengan benar:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Install Dependencies

```bash
cd web-admin
npm install
```

### 3. Start Backend (Terminal 1)

```bash
cd backend
python app.py
# atau
python3 app.py
```

### 4. Start Frontend (Terminal 2)

```bash
cd web-admin
npm run dev
```

### 5. Akses Aplikasi

Buka browser dan pergi ke: `http://localhost:3000`

## 🔄 Flow Authentication

### First Time Access:
1. **Status Page** (`/auth/status`) - Pilih "GET STARTED" atau "I ALREADY HAVE AN ACCOUNT"
2. **Sign Up** (`/auth/signup`) - Buat akun baru dengan form atau Google
3. **Login** (`/auth/login`) - Masuk dengan akun yang sudah ada
4. **Home Page** (`/`) - Dashboard admin setelah berhasil auth

### Subsequent Access:
- Langsung masuk ke Home Page jika sudah pernah login (persistent auth)
- Otomatis redirect ke Status Page jika session expired

## 📱 Halaman-halaman

### 1. Status Page (`/auth/status`)
- **Design**: Sesuai mockup dengan Apple logo, gradient background, decorative circles
- **Function**: Halaman pertama untuk memilih apakah sudah punya akun atau belum
- **Navigation**: 
  - "GET STARTED" → Sign Up Page
  - "I ALREADY HAVE AN ACCOUNT" → Login Page

### 2. Sign Up Page (`/auth/signup`)
- **Design**: Form dengan gradient background sesuai mockup
- **Fields**: Username, Email, Password, Confirm Password
- **Options**: Email/Password signup atau Google signup
- **Validation**: Email format, password min 6 karakter, password match
- **Navigation**: Link ke Login Page

### 3. Login Page (`/auth/login`)
- **Design**: Form dengan gradient background sesuai mockup  
- **Fields**: Email, Password dengan show/hide toggle
- **Options**: Email/Password login atau Google login
- **Navigation**: Link ke Sign Up Page

### 4. Home Page (`/`)
- **Protection**: Hanya bisa diakses setelah login
- **Features**: Navbar dengan info user dan tombol logout
- **Content**: Dashboard admin yang sudah ada sebelumnya

## 🛡️ Security Features

- **JWT Tokens**: Backend menggunakan JWT untuk session management
- **Password Hashing**: Bcrypt untuk hash password
- **Firebase Auth**: Integrasi dengan Firebase Authentication
- **Token Refresh**: Automatic token refresh untuk persistent login
- **CORS Protection**: Backend sudah setup CORS dengan proper origins
- **Input Validation**: Client dan server-side validation
- **Protected Routes**: Route protection dengan automatic redirect

## 🗄️ Data Structure

### Firebase Collection: `admins`
```json
{
  "id": "auto-generated-id",
  "displayName": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "authProvider": "email", // atau "google"
  "emailVerified": true,
  "profilePicture": "https://...", // untuk Google OAuth
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-01T00:00:00Z", 
  "loginCount": 5,
  "isActive": true
}
```

## 🔧 Backend API Endpoints

### Admin Authentication:
- `POST /api/admin/auth/signup` - Admin signup dengan email/password
- `POST /api/admin/auth/login` - Admin login dengan email/password
- `POST /api/admin/auth/google` - Admin Google OAuth
- `GET /api/admin/auth/profile` - Get admin profile (requires auth)

### Legacy User Endpoints (Mobile App):
- `POST /api/auth/signup` - User signup (mobile app)
- `POST /api/auth/login` - User login (mobile app)
- `POST /api/auth/google` - User Google OAuth (mobile app)

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Firebase config not found"
- **Solution**: Pastikan `.env.local` sudah dikonfigurasi dengan benar
- Restart development server setelah update environment variables

#### 2. "Google OAuth error"
- **Solution**: 
  - Cek Google Console bahwa localhost:3000 sudah ditambahkan ke authorized origins
  - Pastikan Firebase Auth sudah enable Google provider
  - Verifikasi GOOGLE_CLIENT_ID di backend .env

#### 3. "Backend connection error"
- **Solution**:
  - Pastikan backend running di port 5000
  - Cek `firebase-key.json` ada di direktori backend
  - Verify Firebase rules sudah update untuk collection `admins`

#### 4. "Network error"
- **Solution**:
  - Cek firewall/antivirus tidak blocking port 3000/5000
  - Pastikan CORS sudah dikonfigurasi dengan benar
  - Verify `NEXT_PUBLIC_API_URL` di .env.local

#### 5. "Authentication persistence issues"
- **Solution**:
  - Clear browser cookies dan local storage
  - Restart both frontend dan backend
  - Check token expiration settings

## 🚀 Deployment

### Environment Variables untuk Production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_FIREBASE_API_KEY=production-api-key
# ... other Firebase production configs
```

### Steps:
1. Deploy backend dengan proper Firebase service account
2. Update Firebase rules untuk production
3. Deploy frontend dengan production environment variables
4. Update Google OAuth authorized origins untuk production domain

## 📊 Features Comparison

| Feature | Mobile App | Web Admin |
|---------|------------|-----------|
| User Collection | `users` | `admins` |
| Authentication | Firebase Auth | Firebase Auth + Backend JWT |
| Google OAuth | ✅ | ✅ |
| Email/Password | ✅ | ✅ |
| Role Management | User | Admin |
| Persistent Login | ✅ | ✅ |

## 🔮 Future Enhancements

- [ ] Email verification untuk new signups
- [ ] Password reset functionality
- [ ] Admin role hierarchy (super admin, admin, etc.)
- [ ] Two-factor authentication
- [ ] Activity logging dan audit trail
- [ ] Profile management page
- [ ] Bulk admin operations

---

## 👨‍💻 Developer Notes

Sistem ini menggunakan hybrid approach:
1. **Frontend**: Next.js dengan Firebase Auth untuk UI dan session management
2. **Backend**: Flask dengan JWT untuk data validation dan business logic  
3. **Database**: Firebase Firestore dengan separate collections untuk users dan admins
4. **Authentication**: Firebase Auth + Google OAuth dengan backend verification

Keuntungan approach ini:
- Leverage Firebase Auth untuk UI/UX yang smooth
- Backend validation untuk security dan business rules
- Shared Firebase project untuk consistency
- Separate data concerns (users vs admins)

🎉 **Ready to use!** Sistem authentication sudah siap digunakan dan terintegrasi dengan Firebase existing.

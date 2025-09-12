# 🔥 Firebase Setup Test Script

Jalankan script ini untuk download service account key dari Firebase Console:

## 📋 Langkah Manual:

1. **Buka Firebase Console**
   - https://console.firebase.google.com/
   - Pilih project "smartparking-7af65"

2. **Download Service Account Key**
   - Klik gear icon ⚙️ → Project Settings
   - Tab "Service accounts"  
   - Klik "Generate new private key"
   - Download file JSON

3. **Simpan Key**
   - Rename file menjadi: `firebase-key.json`
   - Copy ke: `C:\Users\shafi\OneDrive\Documents\GoPark\GoPark\backend\firebase-key.json`

4. **Test Connection**
   ```bash
   cd backend
   python test_firebase.py
   ```

## 🚨 Jika Tidak Bisa Download

Buat file `firebase-key-template.json` dengan template ini (ganti dengan data dari Firebase Console):

```json
{
  "type": "service_account",
  "project_id": "smartparking-7af65",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@smartparking-7af65.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID", 
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CLIENT_X509_CERT_URL"
}
```

Rename menjadi `firebase-key.json` setelah diisi.

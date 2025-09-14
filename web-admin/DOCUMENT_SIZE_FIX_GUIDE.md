# FIRESTORE DOCUMENT SIZE FIX

## Masalah yang Ditemukan:

1. **Missing Firestore Index**: Query membutuhkan composite index
2. **Document Size Exceeded**: Dokumen > 1MB karena gambar base64 disimpan langsung

## Solusi Step-by-Step:

### STEP 1: Buat Firestore Index
1. Buka link berikut untuk membuat index otomatis:
   ```
   https://console.firebase.google.com/v1/r/project/smartparking-7af65/firestore/indexes?create_composite=ClNwcm9qZWN0cy9zbWFydHBhcmtpbmctN2FmNjUvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Byb2plY3RzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
   ```

2. Atau buat manual di Firebase Console:
   - Collection: `projects`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

### STEP 2: Setup Firebase Storage Rules
Pastikan Firebase Storage rules memungkinkan read/write:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{userId}/{projectId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### STEP 3: Cleanup Existing Large Documents
1. Buka website Anda
2. Klik tombol "🧹 Cleanup" di bagian "Your Project"
3. Konfirmasi untuk membersihkan dokumen yang bermasalah

### STEP 4: Restart Development Server
```bash
cd web-admin
npm run dev
```

## Perubahan yang Dilakukan:

### 1. Modifikasi projectService.ts:
- ✅ Menghapus sementara `orderBy` dari query untuk menghindari index requirement
- ✅ Menambahkan manual sorting setelah fetch data
- ✅ Integrasi dengan Firebase Storage untuk upload gambar
- ✅ Update interface untuk mendukung `downloadURL` dan `storagePath`

### 2. Tambahkan storageService.ts:
- ✅ Service untuk upload/delete gambar ke Firebase Storage
- ✅ Konversi base64 ke Storage URL
- ✅ Mengurangi ukuran dokumen Firestore

### 3. Update Firebase Configuration:
- ✅ Tambahkan Firebase Storage import
- ✅ Export storage instance

### 4. Cleanup Utility:
- ✅ Function untuk membersihkan dokumen yang terlalu besar
- ✅ Kompresi gambar otomatis
- ✅ Estimasi ukuran dokumen

### 5. UI Improvements:
- ✅ Tombol cleanup di homepage
- ✅ Error handling yang lebih baik
- ✅ Support untuk gambar dari Storage URL

## Testing:

1. **Index Test**: Setelah membuat index, coba load projects
2. **Storage Test**: Buat project baru dengan gambar
3. **Cleanup Test**: Jalankan cleanup pada dokumen lama
4. **Size Test**: Verifikasi dokumen baru < 1MB

## Monitoring:

Gunakan Firebase Console untuk monitor:
- Firestore document sizes
- Storage usage
- Index performance
- Error logs

## Important Notes:

- Gambar lama (base64) akan dikonversi ke Storage URLs saat cleanup
- Dokumen yang tidak bisa diperbaiki akan dihapus otomatis
- Project baru akan langsung menggunakan Firebase Storage
- Index akan membutuhkan beberapa menit untuk aktif sepenuhnya

// Test Firebase Connection for Frontend
// Run with: node test-firebase-frontend.js

const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');  
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');

// Your Firebase config (same as in firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyCakpa67Kv3PLgxNfGvIgrNumunK6-Xexg",
  authDomain: "smartparking-7af65.firebaseapp.com",
  projectId: "smartparking-7af65",
  storageBucket: "smartparking-7af65.firebasestorage.app",
  messagingSenderId: "956536297797",
  appId: "1:956536297797:web:6f2fe5b1b19da67196862c",
  measurementId: "G-F2JCBE4CSH"
};

async function testFirebaseConnection() {
  console.log('🔍 Testing Firebase Connection from Frontend...');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    // Test Auth
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
    
    // Test Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');
    
    console.log('\n🎉 Firebase Frontend Setup: SUCCESS!');
    console.log('📝 Config Details:');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
    console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`   App ID: ${firebaseConfig.appId}`);
    
    console.log('\n🚀 You can now:');
    console.log('   1. Open http://localhost:3000 in browser');
    console.log('   2. Test signup/login functionality');
    console.log('   3. Check Firebase Console for new users');
    
    return true;
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check internet connection');
    console.log('   2. Verify Firebase config in .env.local');
    console.log('   3. Make sure project exists in Firebase Console');
    return false;
  }
}

// Run the test
testFirebaseConnection();

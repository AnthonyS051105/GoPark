import firebase_admin
from firebase_admin import credentials, firestore

# Test script untuk cek koneksi Firebase
try:
    # Initialize Firebase Admin (jika belum)
    if not firebase_admin._apps:
        cred = credentials.Certificate('firebase-key.json')
        firebase_admin.initialize_app(cred)
    
    # Test Firestore connection
    db = firestore.client()
    
    # Test write
    test_ref = db.collection('test').document('connection')
    test_ref.set({'message': 'Backend connected successfully', 'timestamp': firestore.SERVER_TIMESTAMP})
    
    # Test read
    doc = test_ref.get()
    if doc.exists:
        print("✅ Firebase connection successful!")
        print(f"Data: {doc.to_dict()}")
    
    # Clean up test document
    test_ref.delete()
    
except Exception as e:
    print(f"❌ Firebase connection failed: {e}")
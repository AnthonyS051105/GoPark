// Test Firestore connection and project functionality
// Run this to test if projects are saved and retrieved correctly

import { projectService } from '../src/services/projectService';
import { auth } from '../src/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

async function testProjectService() {
  try {
    console.log('🧪 Starting Firestore project service test...');
    
    // Test authentication first
    console.log('🔐 Testing authentication...');
    // Replace with your test credentials
    await signInWithEmailAndPassword(auth, 'test@example.com', 'testpassword');
    console.log('✅ Authentication successful');
    
    // Test saving a project
    console.log('💾 Testing project save...');
    const testProject = await projectService.saveProject({
      name: 'Test Parking Mall',
      address: 'Jl. Test No. 123, Jakarta',
      images: [
        {
          id: 'test-image-1',
          label: 'Entrance',
          preview: 'data:image/png;base64,test',
          fileName: 'entrance.jpg'
        }
      ]
    });
    console.log('✅ Project saved:', testProject.id);
    
    // Test retrieving projects
    console.log('📥 Testing project retrieval...');
    const projects = await projectService.getProjects();
    console.log('✅ Projects retrieved:', projects.length);
    
    // Test getting project by ID
    console.log('🔍 Testing get project by ID...');
    const retrievedProject = await projectService.getProjectById(testProject.id);
    console.log('✅ Project retrieved by ID:', retrievedProject?.name);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testProjectService();

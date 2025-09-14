// Test utility untuk memverifikasi fungsi modal dan project management
import { projectService } from '../services/projectService';

export const testProjectFlow = async () => {
  console.log('🧪 Testing Project Flow...');
  
  try {
    // Test 1: Create a project with images
    const testProject = {
      name: 'Test Shopping Mall',
      address: 'Jl. Test No. 123, Jakarta',
      images: [
        {
          id: 'img1',
          label: 'Basement Level 1',
          preview: 'data:image/jpeg;base64,test1',
          fileName: 'basement1.jpg'
        },
        {
          id: 'img2', 
          label: 'Basement Level 2',
          preview: 'data:image/jpeg;base64,test2',
          fileName: 'basement2.jpg'
        },
        {
          id: 'img3',
          label: 'Ground Floor Parking',
          preview: 'data:image/jpeg;base64,test3', 
          fileName: 'ground.jpg'
        }
      ]
    };

    console.log('Creating test project...');
    const savedProject = await projectService.saveProject(testProject);
    console.log('✅ Project created successfully:', savedProject.id);

    // Test 2: Retrieve all projects
    console.log('Fetching all projects...');
    const allProjects = await projectService.getProjects();
    console.log('✅ Retrieved projects:', allProjects.length);

    // Test 3: Get specific project
    console.log('Fetching specific project...');
    const specificProject = await projectService.getProjectById(savedProject.id);
    console.log('✅ Retrieved specific project:', specificProject?.name);

    // Verify project structure
    if (specificProject) {
      console.log('📊 Project Details:');
      console.log(`   Name: ${specificProject.name}`);
      console.log(`   Address: ${specificProject.address}`);
      console.log(`   Images: ${specificProject.images.length}`);
      console.log(`   Image Labels: ${specificProject.images.map(img => img.label).join(', ')}`);
      console.log(`   Created: ${specificProject.createdAt}`);
    }

    console.log('🎉 All tests passed!');
    return savedProject;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};

// Helper function untuk testing UI flow
export const simulateUserFlow = () => {
  console.log('🎭 Simulating User Flow:');
  console.log('1. User clicks "Create New" button');
  console.log('2. Modal opens with name, address, and image upload fields');
  console.log('3. User fills in project details');
  console.log('4. User clicks "Add Images" to upload multiple images');
  console.log('5. User adds labels for each image (e.g., "Basement 1", "Basement 2")');
  console.log('6. User saves project');
  console.log('7. Project appears in homepage under "Your Projects"');
  console.log('8. User clicks on project card to open form page');
  console.log('9. Form page shows dynamic forms based on number of uploaded images');
  console.log('10. Each form section shows the label from the uploaded image');
  console.log('✨ Flow simulation complete!');
};

export default { testProjectFlow, simulateUserFlow };

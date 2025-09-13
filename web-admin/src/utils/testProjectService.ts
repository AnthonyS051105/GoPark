// Testing the project service
import { projectService } from '../services/projectService';

// Example usage and testing
async function testProjectService() {
  try {
    console.log('Testing Project Service...');

    // Create a sample project
    const sampleProject = await projectService.saveProject({
      name: 'Test Mall Parking',
      address: 'Jl. Test No. 123, Jakarta',
      images: [
        {
          id: '1',
          label: 'Basement Level 1',
          preview: 'data:image/jpeg;base64,test-data',
          fileName: 'basement1.jpg'
        },
        {
          id: '2',
          label: 'Basement Level 2',
          preview: 'data:image/jpeg;base64,test-data2',
          fileName: 'basement2.jpg'
        }
      ]
    });

    console.log('Created project:', sampleProject);

    // Get all projects
    const allProjects = await projectService.getProjects();
    console.log('All projects:', allProjects);

    // Get project by ID
    const retrievedProject = await projectService.getProjectById(sampleProject.id);
    console.log('Retrieved project:', retrievedProject);

    return sampleProject;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

export { testProjectService };

// Debug utilities untuk project management
import { projectService } from '../services/projectService';

export const debugUtils = {
  // Clear all projects (for testing)
  clearAllProjects: () => {
    console.log('🗑️ Clearing all projects...');
    // Access the internal projects array and clear it
    const projectsModule = require('../services/projectService');
    if (projectsModule.projects) {
      projectsModule.projects.length = 0;
      console.log('✅ All projects cleared');
    }
  },

  // Get current projects count
  getProjectsCount: async () => {
    try {
      const projects = await projectService.getProjects();
      console.log(`📊 Current projects count: ${projects.length}`);
      return projects.length;
    } catch (error) {
      console.error('❌ Error getting projects count:', error);
      return 0;
    }
  },

  // List all projects
  listAllProjects: async () => {
    try {
      const projects = await projectService.getProjects();
      console.log('📋 All projects:');
      projects.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project.name} (ID: ${project.id})`);
        console.log(`     Address: ${project.address}`);
        console.log(`     Images: ${project.images.length}`);
        console.log(`     Created: ${project.createdAt}`);
      });
      return projects;
    } catch (error) {
      console.error('❌ Error listing projects:', error);
      return [];
    }
  },

  // Create test project
  createTestProject: async () => {
    try {
      const testProject = {
        name: `Test Project ${Date.now()}`,
        address: 'Test Address, Jakarta',
        images: [
          {
            id: 'test1',
            label: 'Test Image 1',
            preview: 'data:image/jpeg;base64,test1',
            fileName: 'test1.jpg'
          }
        ]
      };

      const savedProject = await projectService.saveProject(testProject);
      console.log('✅ Test project created:', savedProject.id);
      return savedProject;
    } catch (error) {
      console.error('❌ Error creating test project:', error);
      throw error;
    }
  }
};

// Make it available globally for debugging in console
if (typeof window !== 'undefined') {
  (window as any).debugUtils = debugUtils;
}

export default debugUtils;

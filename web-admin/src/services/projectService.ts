// web-admin/src/services/projectService.ts
export interface ProjectData {
  id: string;
  name: string;
  address: string;
  images: ImageData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageData {
  id: string;
  label: string;
  preview: string;
  fileName: string;
}

// Temporary storage (in production, this should be a real database)
let projects: ProjectData[] = [];

export const projectService = {
  // Save a new project
  async saveProject(data: { name: string; address: string; images: ImageData[] }): Promise<ProjectData> {
    const project: ProjectData = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    projects.push(project);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return project;
  },

  // Get all projects
  async getProjects(): Promise<ProjectData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projects];
  },

  // Get a project by ID
  async getProjectById(id: string): Promise<ProjectData | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return projects.find(project => project.id === id) || null;
  },

  // Update a project
  async updateProject(id: string, data: Partial<ProjectData>): Promise<ProjectData | null> {
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      return null;
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...data,
      updatedAt: new Date()
    };

    await new Promise(resolve => setTimeout(resolve, 400));
    return projects[projectIndex];
  },

  // Delete a project
  async deleteProject(id: string): Promise<boolean> {
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      return false;
    }

    projects.splice(projectIndex, 1);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
};

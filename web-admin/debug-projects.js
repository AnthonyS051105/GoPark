// Debug helper for checking project persistence
// Add this to your browser console to debug project issues

console.log("🔍 GoPark Project Debug Helper");

// Check current user authentication
async function checkAuth() {
  try {
    const { auth } = await import('./src/lib/firebase');
    console.log("👤 Current User:", auth.currentUser);
    console.log("🆔 User ID:", auth.currentUser?.uid);
    console.log("📧 Email:", auth.currentUser?.email);
    return auth.currentUser;
  } catch (error) {
    console.error("❌ Auth check failed:", error);
  }
}

// Check projects in Firestore
async function checkProjects() {
  try {
    const { projectService } = await import('./src/services/projectService');
    const projects = await projectService.getProjects();
    console.log("📊 Projects in Firestore:", projects);
    console.log("📈 Project count:", projects.length);
    return projects;
  } catch (error) {
    console.error("❌ Project check failed:", error);
  }
}

// Test project creation
async function testCreateProject() {
  try {
    const { projectService } = await import('./src/services/projectService');
    const testProject = await projectService.saveProject({
      name: 'Debug Test Project',
      address: 'Test Address 123',
      images: []
    });
    console.log("✅ Test project created:", testProject);
    return testProject;
  } catch (error) {
    console.error("❌ Test project creation failed:", error);
  }
}

// Run all checks
async function debugAll() {
  console.log("🚀 Running all debug checks...");
  await checkAuth();
  await checkProjects();
  console.log("✅ Debug checks complete");
}

// Make functions available globally
window.debugGoPark = {
  checkAuth,
  checkProjects,
  testCreateProject,
  debugAll
};

console.log("📝 Available debug functions:");
console.log("- debugGoPark.checkAuth() - Check current authentication");
console.log("- debugGoPark.checkProjects() - Check projects in Firestore");
console.log("- debugGoPark.testCreateProject() - Create a test project");
console.log("- debugGoPark.debugAll() - Run all checks");

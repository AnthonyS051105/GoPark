// web-admin/src/utils/testImageUpload.ts
import { storageService } from '../services/storageService';

export const testImageUpload = async () => {
  try {
    console.log('🧪 Testing image upload...');
    
    // Create a small test base64 image (1x1 pixel red dot)
    const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const testProjectId = 'test_' + Date.now();
    const testFileName = 'test_image.png';
    
    // Test upload
    const result = await storageService.uploadImageFromBase64(
      testBase64,
      testFileName,
      testProjectId
    );
    
    console.log('✅ Test upload successful:', result);
    
    // Test cleanup (delete the test image)
    await storageService.deleteImage(result.storagePath);
    console.log('✅ Test cleanup successful');
    
    return {
      success: true,
      message: 'Image upload test passed'
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

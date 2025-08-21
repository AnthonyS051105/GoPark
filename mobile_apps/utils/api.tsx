// API Configuration for SmartParking Backend

// ✅ Multiple IP addresses to try (in priority order)
const POSSIBLE_BASE_URLS = [
  'http://10.72.12.185:5000/api', // Current network interface - UPDATED
  'http://localhost:5000/api', // Local fallback
  'http://127.0.0.1:5000/api', // Loopback fallback
  'http://192.168.122.1:5000/api', // Virtual interface
];

const API_CONFIG = {
  // Base URL configuration
  BASE_URL: __DEV__
    ? process.env.EXPO_PUBLIC_API_URL || POSSIBLE_BASE_URLS[0] // Use primary IP
    : 'https://your-production-api.com/api', // Production

  // API Endpoints - sesuai dengan backend Flask
  ENDPOINTS: {
    LOGIN: '/auth/login', // POST /api/auth/login
    SIGNUP: '/auth/signup', // POST /api/auth/signup
    GOOGLE_LOGIN: '/auth/google', // POST /api/auth/google
    VERIFY_TOKEN: '/auth/verify', // POST /api/auth/verify
    PROFILE: '/auth/profile', // GET /api/auth/profile
    UPDATE_PROFILE: '/auth/profile', // PUT /api/auth/profile (future)
  },

  // All possible URLs for testing
  FALLBACK_URLS: POSSIBLE_BASE_URLS,

  // Request configuration
  TIMEOUT: 10000, // 10 seconds

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// Helper function untuk mendapatkan full URL
export const getApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log(`🔗 API URL: ${fullUrl}`); // Debug log
  return fullUrl;
};

// ✅ NEW: Function to test connectivity to all possible URLs
export const testConnectivity = async (): Promise<string | null> => {
  console.log('🔍 Testing connectivity to all possible backend URLs...');

  for (let i = 0; i < POSSIBLE_BASE_URLS.length; i++) {
    const baseUrl = POSSIBLE_BASE_URLS[i];
    const healthUrl = baseUrl.replace('/api', '/health');

    try {
      console.log(`🧪 Testing: ${healthUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${baseUrl} is accessible!`);
        console.log(`📊 Health data:`, data);
        return baseUrl;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ FAILED: ${baseUrl} - ${errorMessage}`);
    }
  }

  console.log('❌ No backend URL is accessible!');
  return null;
};

// Helper function untuk development debugging
export const getApiInfo = (): void => {
  console.log('📡 API Configuration:');
  console.log('Base URL:', API_CONFIG.BASE_URL);
  console.log('Fallback URLs:', API_CONFIG.FALLBACK_URLS);
  console.log('Endpoints:', API_CONFIG.ENDPOINTS);
  console.log('Environment:', __DEV__ ? 'Development' : 'Production');
};

// ✅ NEW: Auto-detect working backend URL
export const autoDetectBackendUrl = async (): Promise<string | null> => {
  console.log('🔍 Auto-detecting working backend URL...');

  const workingUrl = await testConnectivity();
  if (workingUrl) {
    // Update the base URL configuration
    API_CONFIG.BASE_URL = workingUrl;
    console.log(`✅ Updated API_CONFIG.BASE_URL to: ${workingUrl}`);
    return workingUrl;
  }

  console.log('❌ No working backend URL found!');
  return null;
};

export default API_CONFIG;

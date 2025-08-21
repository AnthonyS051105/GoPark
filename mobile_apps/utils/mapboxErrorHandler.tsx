// Mapbox Error Handler Utility
// This utility helps suppress non-critical Mapbox errors like tile loading timeouts

const SUPPRESSED_ERROR_PATTERNS = [
  'Failed to load tile: timeout',
  'mapbox-incidents',
  'tile-id=',
  'source-id=mapbox-incidents',
  'Map load failed',
];

// Override console.error to filter out Mapbox tile errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

export const initializeMapboxErrorSuppression = () => {
  console.error = (...args: any[]) => {
    const message = args.join(' ');

    // Check if this is a Mapbox tile error we want to suppress
    const shouldSuppress = SUPPRESSED_ERROR_PATTERNS.some((pattern) => message.includes(pattern));

    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = (...args: any[]) => {
    const message = args.join(' ');

    // Check if this is a Mapbox tile warning we want to suppress
    const shouldSuppress = SUPPRESSED_ERROR_PATTERNS.some((pattern) => message.includes(pattern));

    if (!shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };
};

export const restoreOriginalConsole = () => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
};

// Initialize error suppression by default
initializeMapboxErrorSuppression();

import React, { useEffect, useState, useCallback } from 'react';
import Mapbox, {
  Camera,
  MapView,
  UserLocation,
  ShapeSource,
  SymbolLayer,
  CircleLayer,
} from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { parkingSpots } from '../../data/parkingData';
import '../../utils/mapboxErrorHandler'; // Import to initialize error suppression

const accessToken =
  'pk.eyJ1IjoiYW50aG9ueTA1IiwiYSI6ImNtZTQ3Y3F0MDAwMHEya29xMWUzcGVyNHcifQ.4CjdWQvtGe1YVYU-C8lR9Q';

// Initialize Mapbox once with error handling
if (accessToken) {
  try {
    Mapbox.setAccessToken(accessToken);
    // Set connection timeout for tile loading
    Mapbox.setTelemetryEnabled(false); // Disable telemetry to reduce network calls
  } catch (error) {
    console.warn('Mapbox initialization error:', error);
  }
}

// Yogyakarta coordinates (near your location)
const YOGYAKARTA_COORDS: [number, number] = [110.374, -7.754];

interface MapProps {
  selectedSpotIndex?: number;
  onSpotPress?: (index: number) => void;
}

export default function Map({ selectedSpotIndex = 0, onSpotPress }: MapProps = {}) {
  const [location, setLocation] = useState<[number, number]>(YOGYAKARTA_COORDS);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          // Use default Yogyakarta coordinates if permission denied
          setLocation(YOGYAKARTA_COORDS);
          return;
        }

        setHasLocationPermission(true);

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation([currentLocation.coords.longitude, currentLocation.coords.latitude]);
      } catch (error) {
        console.log('Error getting location:', error);
        // Fallback to Yogyakarta coordinates
        setLocation(YOGYAKARTA_COORDS);
      }
    })();
  }, []);

  // Handle map ready
  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
    console.log('Map loaded successfully');
  }, []);

  // Handle map errors (suppress tile loading errors)
  const handleMapError = useCallback(() => {
    console.warn('Map failed to load, continuing with basic functionality');
    // Still set map as ready to show parking spots
    setIsMapReady(true);
  }, []);

  // Handle spot press with error handling
  const handleSpotPress = useCallback(
    (event: any) => {
      try {
        if (event.features && event.features[0] && onSpotPress) {
          const index = event.features[0].properties?.index;
          if (typeof index === 'number') {
            onSpotPress(index);
          }
        }
      } catch (error) {
        console.warn('Map spot press error:', error);
      }
    },
    [onSpotPress]
  );

  // Create GeoJSON for parking spots with error handling
  const parkingSpotsGeoJSON = React.useMemo(() => {
    try {
      return {
        type: 'FeatureCollection' as const,
        features: parkingSpots.map((spot, index) => ({
          type: 'Feature' as const,
          id: spot.id.toString(), // Ensure ID is string for Mapbox
          properties: {
            name: spot.name,
            available: spot.available,
            isSelected: index === selectedSpotIndex,
            index,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [spot.longitude, spot.latitude],
          },
        })),
      };
    } catch (error) {
      console.warn('Error creating GeoJSON:', error);
      return {
        type: 'FeatureCollection' as const,
        features: [],
      };
    }
  }, [selectedSpotIndex]);

  if (!accessToken) {
    return null; // Don't render if no access token
  }

  return (
    <MapView
      style={{ flex: 1 }}
      styleURL="mapbox://styles/mapbox/streets-v12" // Use lighter style instead of navigation
      onDidFinishLoadingMap={handleMapReady}
      onDidFailLoadingMap={handleMapError}
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={true}
      scaleBarEnabled={false}>
      <Camera zoomLevel={14} centerCoordinate={location} animationDuration={1000} />

      {hasLocationPermission && isMapReady && (
        <UserLocation visible={true} showsUserHeadingIndicator={true} minDisplacement={10} />
      )}

      {/* Parking Spots Markers - Only render when map is ready */}
      {isMapReady && parkingSpotsGeoJSON.features.length > 0 && (
        <ShapeSource
          id="parkingSpots"
          shape={parkingSpotsGeoJSON}
          onPress={handleSpotPress}
          tolerance={10}>
          {/* Circle layer for parking spots */}
          <CircleLayer
            id="parkingSpotCircles"
            style={{
              circleRadius: [
                'case',
                ['get', 'isSelected'],
                20, // Larger radius for selected spot
                15, // Normal radius
              ],
              circleColor: [
                'case',
                ['get', 'isSelected'],
                '#3B82F6', // Blue for selected
                [
                  'case',
                  ['>', ['get', 'available'], 10],
                  '#10B981', // Green for many spots
                  [
                    'case',
                    ['>', ['get', 'available'], 0],
                    '#F59E0B', // Yellow for few spots
                    '#EF4444', // Red for no spots
                  ],
                ],
              ],
              circleStrokeColor: '#ffffff',
              circleStrokeWidth: [
                'case',
                ['get', 'isSelected'],
                3, // Thicker border for selected
                2, // Normal border
              ],
              circleOpacity: 0.9,
            }}
          />

          {/* Symbol layer for parking icon */}
          <SymbolLayer
            id="parkingSpotIcons"
            style={{
              textField: '🅿️',
              textSize: [
                'case',
                ['get', 'isSelected'],
                16, // Larger text for selected spot
                12, // Normal text size
              ],
              textOffset: [0, 0],
              textAnchor: 'center',
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
}

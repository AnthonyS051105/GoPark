import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

interface ParkingLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
}

interface UseLocationTrackingProps {
  parkingLocations: ParkingLocation[];
  onArriveAtParking?: (location: ParkingLocation) => void;
  onLeaveParking?: (location: ParkingLocation) => void;
}

interface LocationState {
  currentLocation: Location.LocationObject | null;
  nearbyParking: ParkingLocation | null;
  isAtParking: boolean;
  locationPermission: boolean;
  loading: boolean;
  error: string | null;
}

export const useLocationTracking = ({
  parkingLocations,
  onArriveAtParking,
  onLeaveParking,
}: UseLocationTrackingProps) => {
  const [state, setState] = useState<LocationState>({
    currentLocation: null,
    nearbyParking: null,
    isAtParking: false,
    locationPermission: false,
    loading: true,
    error: null,
  });

  // Calculate distance between two coordinates
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3; // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
    },
    []
  );

  // Check if user is near any parking location
  const checkNearbyParking = useCallback(
    (userLocation: Location.LocationObject) => {
      for (const parking of parkingLocations) {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          parking.latitude,
          parking.longitude
        );

        if (distance <= parking.radius) {
          return parking;
        }
      }
      return null;
    },
    [parkingLocations, calculateDistance]
  );

  // Request location permissions
  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setState((prev) => ({
          ...prev,
          error: 'Location permission denied',
          loading: false,
          locationPermission: false,
        }));
        return false;
      }

      setState((prev) => ({
        ...prev,
        locationPermission: true,
        error: null,
      }));
      return true;
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'Failed to request location permission',
        loading: false,
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    requestPermissions,
  };
};

export default useLocationTracking;

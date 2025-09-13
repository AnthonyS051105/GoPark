// Sample parking locations data for testing Live Parking features
export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // meters - detection radius for arrival
  levels: ParkingLevel[];
  operatingHours: {
    open: string;
    close: string;
  };
  features: string[];
}

export interface ParkingLevel {
  id: string;
  name: string;
  available: boolean;
  spots: {
    total: number;
    occupied: number;
    available: number;
  };
  type: 'basement' | 'ground' | 'upper';
}

export const sampleParkingLocations: ParkingLocation[] = [
  {
    id: 'pakuwon-basement',
    name: 'Pakuwon Basement',
    address: 'Pakuwon Mall, Surabaya',
    latitude: -7.2575, // Example coordinates for Surabaya area
    longitude: 112.7521,
    radius: 100, // 100 meters detection radius
    operatingHours: {
      open: '08:00',
      close: '21:30',
    },
    levels: [
      {
        id: 'upper-basement',
        name: 'Upper Basement',
        available: true,
        type: 'basement',
        spots: { total: 150, occupied: 45, available: 105 },
      },
      {
        id: 'lower-basement',
        name: 'Lower Basement',
        available: true,
        type: 'basement',
        spots: { total: 200, occupied: 180, available: 20 },
      },
      {
        id: 'basement-1',
        name: 'Basement',
        available: false,
        type: 'basement',
        spots: { total: 100, occupied: 100, available: 0 },
      },
      {
        id: 'basement-2',
        name: 'Basement',
        available: true,
        type: 'basement',
        spots: { total: 120, occupied: 60, available: 60 },
      },
      {
        id: 'basement-3',
        name: 'Basement',
        available: false,
        type: 'basement',
        spots: { total: 80, occupied: 80, available: 0 },
      },
    ],
    features: ['CCTV', 'Security', '24/7', 'Covered'],
  },
  {
    id: 'tunjungan-plaza',
    name: 'Tunjungan Plaza',
    address: 'Tunjungan Plaza, Surabaya',
    latitude: -7.2634,
    longitude: 112.7378,
    radius: 80,
    operatingHours: {
      open: '10:00',
      close: '22:00',
    },
    levels: [
      {
        id: 'ground-floor',
        name: 'Ground Floor',
        available: true,
        type: 'ground',
        spots: { total: 80, occupied: 70, available: 10 },
      },
      {
        id: 'upper-level-1',
        name: 'Upper Level 1',
        available: true,
        type: 'upper',
        spots: { total: 120, occupied: 90, available: 30 },
      },
      {
        id: 'upper-level-2',
        name: 'Upper Level 2',
        available: true,
        type: 'upper',
        spots: { total: 100, occupied: 50, available: 50 },
      },
    ],
    features: ['CCTV', 'Valet', 'EV Charging', 'Disabled Access'],
  },
];

// Function to get parking location by ID
export const getParkingLocationById = (id: string): ParkingLocation | undefined => {
  return sampleParkingLocations.find((location) => location.id === id);
};

// Function to simulate real-time updates for parking spots
export const simulateSpotUpdates = (level: ParkingLevel): ParkingLevel => {
  const randomChange = Math.floor(Math.random() * 10) - 5; // -5 to +5 change
  const newOccupied = Math.max(0, Math.min(level.spots.total, level.spots.occupied + randomChange));
  const newAvailable = level.spots.total - newOccupied;

  return {
    ...level,
    spots: {
      ...level.spots,
      occupied: newOccupied,
      available: newAvailable,
    },
  };
};

// Function to check if parking is currently open
export const isParkingOpen = (location: ParkingLocation): boolean => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  const openTime = location.operatingHours.open;
  const closeTime = location.operatingHours.close;

  // Simple time comparison (assumes same day operation)
  return currentTime >= openTime && currentTime <= closeTime;
};

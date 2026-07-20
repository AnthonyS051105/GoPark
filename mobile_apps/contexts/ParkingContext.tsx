import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parkingSpots as initialParkingSpots, ParkingSpot } from '../data/parkingData';

export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  spotId: number;
  spotName: string;
  spotAddress: string;
  durationHours: number;
  hourlyRate: number;
  totalPrice: number;
  paymentMethod: string;
  status: BookingStatus;
  createdAt: string; // ISO string
  completedAt?: string;
}

interface ParkingContextType {
  spots: ParkingSpot[];
  favorites: number[];
  bookings: Booking[];
  activeBooking: Booking | null;
  isFavorite: (spotId: number) => boolean;
  toggleFavorite: (spotId: number) => void;
  createBooking: (
    spot: ParkingSpot,
    durationHours: number,
    paymentMethod: string
  ) => Booking | null;
  completeBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
}

const SPOTS_KEY = 'gopark_spots';
const FAVORITES_KEY = 'gopark_favorites';
const BOOKINGS_KEY = 'gopark_bookings';

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>(initialParkingSpots);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedSpots, storedFavorites, storedBookings] = await Promise.all([
          AsyncStorage.getItem(SPOTS_KEY),
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(BOOKINGS_KEY),
        ]);

        if (storedSpots) setSpots(JSON.parse(storedSpots));
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
        if (storedBookings) setBookings(JSON.parse(storedBookings));
      } catch (error) {
        console.error('Failed to hydrate parking state:', error);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(SPOTS_KEY, JSON.stringify(spots));
  }, [spots, hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings, hydrated]);

  const isFavorite = useCallback((spotId: number) => favorites.includes(spotId), [favorites]);

  const toggleFavorite = useCallback((spotId: number) => {
    setFavorites((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  }, []);

  const createBooking = useCallback(
    (spot: ParkingSpot, durationHours: number, paymentMethod: string): Booking | null => {
      if (spot.available <= 0) return null;

      const booking: Booking = {
        id: `booking-${Date.now()}`,
        spotId: spot.id,
        spotName: spot.name,
        spotAddress: spot.address,
        durationHours,
        hourlyRate: spot.hourlyRate,
        totalPrice: spot.hourlyRate * durationHours,
        paymentMethod,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      setBookings((prev) => [booking, ...prev]);
      setSpots((prev) =>
        prev.map((s) => (s.id === spot.id ? { ...s, available: s.available - 1 } : s))
      );

      return booking;
    },
    []
  );

  const completeBooking = useCallback(
    (bookingId: string) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking || booking.status !== 'active') return;

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: 'completed', completedAt: new Date().toISOString() }
            : b
        )
      );
      setSpots((prev) =>
        prev.map((s) => (s.id === booking.spotId ? { ...s, available: s.available + 1 } : s))
      );
    },
    [bookings]
  );

  const cancelBooking = useCallback(
    (bookingId: string) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking || booking.status !== 'active') return;

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      setSpots((prev) =>
        prev.map((s) => (s.id === booking.spotId ? { ...s, available: s.available + 1 } : s))
      );
    },
    [bookings]
  );

  const activeBooking = bookings.find((b) => b.status === 'active') || null;

  const value: ParkingContextType = {
    spots,
    favorites,
    bookings,
    activeBooking,
    isFavorite,
    toggleFavorite,
    createBooking,
    completeBooking,
    cancelBooking,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export const useParking = (): ParkingContextType => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};

export default ParkingContext;

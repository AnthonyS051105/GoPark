import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StatusBar, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Map from '../components/maps/Map';
import SearchBar from '../components/dashboard/SearchBar';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import LocationButton from '../components/dashboard/LocationButton';
import DraggablePullUpPanel from '../components/dashboard/DraggablePullUpPanel';
import BookingModal from '../components/booking/BookingModal';
import BookingSuccessModal from '../components/booking/BookingSuccessModal';
import ActiveBookingBanner from '../components/booking/ActiveBookingBanner';
import ArrivalNotification from '../components/notifications/ArrivalNotification';
import { filterSpotsBySearch, sortSpotsByDistance, ParkingSpot } from '../data/parkingData';
import { useParking, Booking } from '../contexts/ParkingContext';
import navigationService from '../services/navigationService';

const ARRIVAL_RADIUS_METERS = 150;

const distanceInMeters = (
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number]
): number => {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function DashboardPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ focusSpotId?: string }>();
  const { spots, createBooking, completeBooking, activeBooking } = useParking();

  const [activeTab, setActiveTab] = useState('parking');
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>(spots);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationState, setNavigationState] = useState('idle');
  const [panelHeight, setPanelHeight] = useState(200);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | null>(null);
  const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [arrivedSpotName, setArrivedSpotName] = useState<string | null>(null);
  const navigatingSpotId = useRef<number | null>(null);
  const notifiedBookingId = useRef<string | null>(null);

  // Keep filtered/sorted list in sync with live spot data (availability changes on booking)
  useEffect(() => {
    setFilteredSpots(sortSpotsByDistance(filterSpotsBySearch(spots, '')));
  }, [spots]);

  // Focus a spot coming back from Search/Favorite/History pages
  useEffect(() => {
    if (!params.focusSpotId) return;
    const index = filteredSpots.findIndex((s) => s.id === Number(params.focusSpotId));
    if (index !== -1) setSelectedSpotIndex(index);
  }, [params.focusSpotId, filteredSpots]);

  // Detect arrival at the actively booked spot
  useEffect(() => {
    if (!activeBooking || !userLocation) return;
    if (notifiedBookingId.current === activeBooking.id) return;

    const spot = spots.find((s) => s.id === activeBooking.spotId);
    if (!spot) return;

    const distance = distanceInMeters(userLocation, [spot.longitude, spot.latitude]);
    if (distance <= ARRIVAL_RADIUS_METERS) {
      notifiedBookingId.current = activeBooking.id;
      setArrivedSpotName(spot.name);
    }
  }, [activeBooking, userLocation, spots]);

  const handleSpotSelect = useCallback((index: number) => {
    setSelectedSpotIndex(index);
  }, []);

  const handlePanelScroll = useCallback((index: number) => {
    setSelectedSpotIndex(index);
  }, []);

  const handleStartNavigation = useCallback(
    async (index: number, spot: ParkingSpot) => {
      if (!userLocation) {
        Alert.alert('Location unavailable', 'Waiting for your current location.');
        return;
      }

      setIsNavigating(true);
      setNavigationState('calculating');
      navigatingSpotId.current = spot.id;

      try {
        const route = await navigationService.startNavigation(
          { latitude: userLocation[1], longitude: userLocation[0] },
          { latitude: spot.latitude, longitude: spot.longitude }
        );
        setRouteCoordinates(route.coordinates as [number, number][]);
        setNavigationState('navigating');
      } catch (error) {
        console.warn('Navigation failed:', error);
        setNavigationState('idle');
        setIsNavigating(false);
        Alert.alert('Navigation failed', 'Could not calculate a route. Please try again.');
      }
    },
    [userLocation]
  );

  const handleStopNavigation = useCallback(() => {
    navigationService.stopNavigation();
    setIsNavigating(false);
    setNavigationState('idle');
    setRouteCoordinates(null);
    navigatingSpotId.current = null;
  }, []);

  const handlePanelHeightChange = useCallback((height: number) => {
    setPanelHeight(height);
  }, []);

  const handleLocationPress = useCallback(() => {
    setRecenterTrigger((prev) => prev + 1);
  }, []);

  const handleLocationChange = useCallback((coords: [number, number]) => {
    setUserLocation(coords);
  }, []);

  const handleOpenBooking = useCallback((spot: ParkingSpot) => {
    setBookingSpot(spot);
  }, []);

  const handleConfirmBooking = useCallback(
    (durationHours: number, paymentMethod: string) => {
      if (!bookingSpot) return;
      const booking = createBooking(bookingSpot, durationHours, paymentMethod);
      setBookingSpot(null);
      if (booking) {
        setSuccessBooking(booking);
        if (navigatingSpotId.current === bookingSpot.id) {
          handleStopNavigation();
        }
      } else {
        Alert.alert('Booking failed', 'This spot no longer has any available space.');
      }
    },
    [bookingSpot, createBooking, handleStopNavigation]
  );

  const handleFinishActiveBooking = useCallback(() => {
    if (!activeBooking) return;
    Alert.alert('Finish parking?', `End your booking at ${activeBooking.spotName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Finish',
        onPress: () => completeBooking(activeBooking.id),
      },
    ]);
  }, [activeBooking, completeBooking]);

  const handleTabPress = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);

      switch (tabId) {
        case 'home':
          break;
        case 'favorite':
          router.push('/favorite');
          break;
        case 'parking':
          router.push('/live-parking' as any);
          break;
        case 'history':
          router.push('/history');
          break;
        case 'profile':
          router.push('/profile');
          break;
        default:
          break;
      }
    },
    [router]
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'GoPark',
          headerShown: false,
        }}
      />

      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={{ flex: 1 }}>
        <Map
          spots={filteredSpots}
          selectedSpotIndex={selectedSpotIndex}
          onSpotPress={handleSpotSelect}
          onLocationChange={handleLocationChange}
          recenterTrigger={recenterTrigger}
          routeCoordinates={isNavigating ? routeCoordinates : null}
        />

        <SearchBar placeholder="Search here" onPress={() => router.push('/search')} />

        <ArrivalNotification
          parkingName={arrivedSpotName ?? ''}
          isVisible={!!arrivedSpotName}
          onDismiss={() => setArrivedSpotName(null)}
          onNavigateToLiveParking={() => {
            setArrivedSpotName(null);
            router.push('/live-parking' as any);
          }}
        />

        {activeBooking && (
          <ActiveBookingBanner booking={activeBooking} onFinish={handleFinishActiveBooking} />
        )}

        <LocationButton onPress={handleLocationPress} panelHeight={panelHeight} />

        <DraggablePullUpPanel
          spots={filteredSpots}
          selectedIndex={selectedSpotIndex}
          onSpotSelect={handleSpotSelect}
          onScroll={handlePanelScroll}
          onStartNavigation={handleStartNavigation}
          onBookSpot={handleOpenBooking}
          isNavigating={isNavigating}
          navigationState={navigationState}
          onPanelHeightChange={handlePanelHeightChange}
        />

        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

        <BookingModal
          visible={!!bookingSpot}
          spot={bookingSpot}
          onClose={() => setBookingSpot(null)}
          onConfirm={handleConfirmBooking}
        />

        <BookingSuccessModal
          visible={!!successBooking}
          booking={successBooking}
          onClose={() => setSuccessBooking(null)}
        />
      </View>
    </View>
  );
}

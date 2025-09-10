import React, { useState, useCallback, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Map from '../components/maps/Map';
import SearchBar from '../components/dashboard/SearchBar';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import LocationButton from '../components/dashboard/LocationButton';
import DraggablePullUpPanel from '../components/dashboard/DraggablePullUpPanel';
import { parkingSpots, filterSpotsBySearch, sortSpotsByDistance } from '../data/parkingData';

export default function DashboardPage() {
  const router = useRouter();
  const [searchText] = useState('');
  const [activeTab, setActiveTab] = useState('parking');
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [filteredSpots, setFilteredSpots] = useState(parkingSpots);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationState, setNavigationState] = useState('idle');
  const [panelHeight, setPanelHeight] = useState(200); // Default collapsed height (120 + 80 bottom nav)

  // Filter and sort spots when search text changes
  useEffect(() => {
    let spots = filterSpotsBySearch(parkingSpots, searchText);
    spots = sortSpotsByDistance(spots);
    setFilteredSpots(spots);
    setSelectedSpotIndex(0); // Reset selection when spots change
  }, [searchText]);

  // Handle spot selection from panel
  const handleSpotSelect = useCallback((index: number) => {
    setSelectedSpotIndex(index);
  }, []);

  // Handle scroll events from panel to update map
  const handlePanelScroll = useCallback((index: number) => {
    setSelectedSpotIndex(index);
    // Here you could update map center to show selected spot
  }, []);

  // Handle navigation start
  const handleStartNavigation = useCallback((index: number, spot: any) => {
    setIsNavigating(true);
    setNavigationState('calculating');

    // Simulate navigation calculation
    setTimeout(() => {
      setNavigationState('navigating');
    }, 2000);

    console.log('Starting navigation to:', spot.name);
  }, []);

  // Handle panel height change
  const handlePanelHeightChange = useCallback((height: number) => {
    setPanelHeight(height);
  }, []);

  // Handle location button press
  const handleLocationPress = useCallback(() => {
    // This would center map on user location
    console.log('Centering map on user location');
  }, []);

  // Handle tab press
  const handleTabPress = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);

      // Handle different tab actions
      switch (tabId) {
        case 'home':
          // Stay on dashboard/home
          console.log('Home tab pressed');
          break;
        case 'favorite':
          // Navigate to favorite page
          router.push('/favorite');
          break;
        case 'parking':
          // Reset navigation state when going back to parking
          setIsNavigating(false);
          setNavigationState('idle');
          console.log('Parking tab pressed');
          break;
        case 'history':
          // Navigate to history page
          router.push('/history');
          break;
        case 'profile':
          // Navigate to profile page
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

      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Container */}
      <View style={{ flex: 1 }}>
        <Map selectedSpotIndex={selectedSpotIndex} onSpotPress={handleSpotSelect} />

        {/* Search Bar Overlay */}
        <SearchBar placeholder="Search here" />

        {/* Location Button */}
        <LocationButton onPress={handleLocationPress} panelHeight={panelHeight} />

        {/* Draggable Pull-up Panel */}
        <DraggablePullUpPanel
          spots={filteredSpots}
          selectedIndex={selectedSpotIndex}
          onSpotSelect={handleSpotSelect}
          onScroll={handlePanelScroll}
          onStartNavigation={handleStartNavigation}
          isNavigating={isNavigating}
          navigationState={navigationState}
          onPanelHeightChange={handlePanelHeightChange}
        />

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
}

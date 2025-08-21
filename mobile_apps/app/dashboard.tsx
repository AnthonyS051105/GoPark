import React, { useState, useCallback, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import Map from '../components/maps/Map';
import SearchBar from '../components/dashboard/SearchBar';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import LocationButton from '../components/dashboard/LocationButton';
import DraggablePullUpPanel from '../components/dashboard/DraggablePullUpPanel';
import { parkingSpots, filterSpotsBySearch, sortSpotsByDistance } from '../data/parkingData';

export default function DashboardPage() {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('parking');
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const [filteredSpots, setFilteredSpots] = useState(parkingSpots);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationState, setNavigationState] = useState('idle');

  // Filter and sort spots when search text changes
  useEffect(() => {
    let spots = filterSpotsBySearch(parkingSpots, searchText);
    spots = sortSpotsByDistance(spots);
    setFilteredSpots(spots);
    setSelectedSpotIndex(0); // Reset selection when spots change
  }, [searchText]);

  // Handle search functionality
  const handleSearch = useCallback(() => {
    // Search is already handled by useEffect when searchText changes
    console.log('Searching for:', searchText);
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

  // Handle location button press
  const handleLocationPress = useCallback(() => {
    // This would center map on user location
    console.log('Centering map on user location');
  }, []);

  // Handle tab press
  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'parking') {
      setIsNavigating(false);
      setNavigationState('idle');
    }
  }, []);

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
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
          placeholder="Search here"
        />

        {/* Location Button */}
        <LocationButton onPress={handleLocationPress} />

        {/* Draggable Pull-up Panel */}
        <DraggablePullUpPanel
          spots={filteredSpots}
          selectedIndex={selectedSpotIndex}
          onSpotSelect={handleSpotSelect}
          onScroll={handlePanelScroll}
          onStartNavigation={handleStartNavigation}
          isNavigating={isNavigating}
          navigationState={navigationState}
        />

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
}

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import ParkingSpotCard from './ParkingSpotCard';

interface ParkingSpot {
  id: number;
  name: string;
  address?: string;
  description?: string;
  available: number;
  total?: number;
  distance?: number;
  hourlyRate?: number;
  rating?: string | number;
  features?: string[];
  hours?: string;
  paymentMethods?: string[];
  latitude: number;
  longitude: number;
}

interface DraggablePullUpPanelProps {
  spots?: ParkingSpot[];
  selectedIndex?: number;
  onSpotSelect?: (index: number) => void;
  onScroll?: (index: number) => void;
  onStartNavigation?: (index: number, spot: ParkingSpot) => void;
  isNavigating?: boolean;
  navigationState?: string;
  onPanelHeightChange?: (height: number) => void;
}

const { height: screenHeight } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = 80; // Height of bottom navigation
const PANEL_HEIGHT = screenHeight * 0.6; // 60% of screen height
const COLLAPSED_HEIGHT = 120; // Height when collapsed (tanpa menambah BOTTOM_NAV_HEIGHT)
const SNAP_POINTS = [
  COLLAPSED_HEIGHT + BOTTOM_NAV_HEIGHT, // Panel + bottom nav
  PANEL_HEIGHT * 0.5 + BOTTOM_NAV_HEIGHT, // Half + bottom nav
  PANEL_HEIGHT + BOTTOM_NAV_HEIGHT, // Full + bottom nav
]; // Collapsed, Half, Full

type FilterType =
  | 'distance'
  | 'availability'
  | 'price'
  | 'rating'
  | 'security'
  | 'time'
  | 'payment'
  | null;

interface FilterOption {
  key: FilterType;
  label: string;
  icon: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'distance', label: 'Nearest', icon: '📍' },
  { key: 'availability', label: 'Available', icon: '🅿️' },
  { key: 'price', label: 'Cheapest', icon: '💰' },
  { key: 'rating', label: 'Top Rated', icon: '⭐' },
  { key: 'security', label: 'Secure', icon: '🔒' },
  { key: 'time', label: '24/7', icon: '🕐' },
  { key: 'payment', label: 'Card OK', icon: '💳' },
];

export default function DraggablePullUpPanel({
  spots = [],
  selectedIndex = 0,
  onSpotSelect,
  onScroll,
  onStartNavigation,
  isNavigating = false,
  navigationState = 'idle',
  onPanelHeightChange,
}: DraggablePullUpPanelProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const panelPosition = useSharedValue(SNAP_POINTS[0]); // Gunakan snap point pertama
  const lastPanelHeight = useRef(SNAP_POINTS[0]); // Gunakan snap point pertama

  // Sort spots based on active filter
  const sortedSpots = useMemo(() => {
    if (!activeFilter) return spots;

    return [...spots].sort((a, b) => {
      try {
        switch (activeFilter) {
          case 'distance':
            // Sort by distance (closest first)
            return (a.distance || 0) - (b.distance || 0);
          case 'availability':
            // Sort by availability (most available first)
            return b.available - a.available;
          case 'price':
            // Sort by price (cheapest first)
            return (a.hourlyRate || 0) - (b.hourlyRate || 0);
          case 'rating':
            // Sort by rating (highest first)
            const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating || 0;
            const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating || 0;
            return ratingB - ratingA;
          case 'security':
            // Sort by security features (secured first)
            const hasSecurityA = a.features?.some(
              (f) => f.toLowerCase().includes('security') || f.toLowerCase().includes('cctv')
            )
              ? 1
              : 0;
            const hasSecurityB = b.features?.some(
              (f) => f.toLowerCase().includes('security') || f.toLowerCase().includes('cctv')
            )
              ? 1
              : 0;
            return hasSecurityB - hasSecurityA;
          case 'time':
            // Sort by 24/7 availability (24/7 first)
            const is24hA = a.hours?.includes('24') ? 1 : 0;
            const is24hB = b.hours?.includes('24') ? 1 : 0;
            return is24hB - is24hA;
          case 'payment':
            // Sort by card payment availability (card accepted first)
            const hasCardA = a.paymentMethods?.some((p) => p.toLowerCase().includes('card'))
              ? 1
              : 0;
            const hasCardB = b.paymentMethods?.some((p) => p.toLowerCase().includes('card'))
              ? 1
              : 0;
            return hasCardB - hasCardA;
          default:
            return 0;
        }
      } catch (error) {
        console.warn('Sorting error:', error);
        return 0;
      }
    });
  }, [spots, activeFilter]);

  // Handle filter selection with simple state management
  const handleFilterPress = useCallback(
    (filter: FilterType) => {
      try {
        // Simple filter toggle without any navigation context dependency
        const newFilter = activeFilter === filter ? null : filter;
        setActiveFilter(newFilter);

        // Log for debugging
        console.log('Filter changed:', newFilter);
      } catch (error) {
        console.warn('Filter selection error:', error);
        // Reset filter on error
        setActiveFilter(null);
      }
    },
    [activeFilter]
  );

  // Auto-scroll to selected item when selectedIndex changes
  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      const cardHeight = 100; // Approximate height of each card
      const scrollOffset = selectedIndex * cardHeight;

      scrollViewRef.current.scrollTo({
        y: scrollOffset,
        animated: true,
      });
    }
  }, [selectedIndex]);

  // Animated style for the panel
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: panelPosition.value,
    };
  });

  // Notify parent about panel height changes with real-time updates
  React.useEffect(() => {
    if (onPanelHeightChange) {
      // Send the actual panel height (excluding bottom nav)
      const actualPanelHeight = SNAP_POINTS[currentSnapPoint] - BOTTOM_NAV_HEIGHT;
      console.log('Panel height changed:', actualPanelHeight, 'Snap point:', currentSnapPoint);
      onPanelHeightChange(actualPanelHeight);
    }
  }, [currentSnapPoint, onPanelHeightChange]);

  // Snap to nearest snap point
  const snapToPoint = useCallback(
    (targetHeight: number) => {
      // Find closest snap point
      let closestSnapPoint = 0;
      let minDistance = Math.abs(targetHeight - SNAP_POINTS[0]);

      SNAP_POINTS.forEach((point, index) => {
        const distance = Math.abs(targetHeight - point);
        if (distance < minDistance) {
          minDistance = distance;
          closestSnapPoint = index;
        }
      });

      const targetSnapHeight = SNAP_POINTS[closestSnapPoint];

      // Update using reanimated
      panelPosition.value = withSpring(targetSnapHeight, {
        damping: 15,
        stiffness: 100,
      });

      // Update state using runOnJS
      runOnJS(setCurrentSnapPoint)(closestSnapPoint);
      lastPanelHeight.current = targetSnapHeight;
    },
    [panelPosition]
  );

  // Pan gesture handler with better responsiveness
  const panGesture = Gesture.Pan()
    .onStart(() => {
      lastPanelHeight.current = panelPosition.value;
    })
    .onUpdate((event) => {
      const newHeight = Math.max(
        SNAP_POINTS[0], // Gunakan snap point minimum
        Math.min(PANEL_HEIGHT + BOTTOM_NAV_HEIGHT, lastPanelHeight.current - event.translationY)
      );
      panelPosition.value = newHeight;
    })
    .onEnd((event) => {
      const velocityY = event.velocityY;
      const currentHeight = panelPosition.value;

      // Reduced velocity threshold for better responsiveness
      if (Math.abs(velocityY) > 300) {
        if (velocityY < 0) {
          // Moving up (expanding)
          const nextPoint = Math.min(currentSnapPoint + 1, SNAP_POINTS.length - 1);
          runOnJS(snapToPoint)(SNAP_POINTS[nextPoint]);
        } else {
          // Moving down (collapsing)
          const nextPoint = Math.max(currentSnapPoint - 1, 0);
          runOnJS(snapToPoint)(SNAP_POINTS[nextPoint]);
        }
      } else {
        // Snap to nearest point
        runOnJS(snapToPoint)(currentHeight);
      }
    });

  // Handle spot selection and notify parent
  const handleSpotPress = useCallback(
    (sortedIndex: number, spot: ParkingSpot) => {
      try {
        // Find the original index of this spot in the unsorted array
        const originalIndex = spots.findIndex((s) => s.id === spot.id);

        if (originalIndex !== -1 && onSpotSelect) {
          // Direct call without setTimeout to avoid timing issues
          onSpotSelect(originalIndex);

          // Also trigger onScroll to update map
          if (onScroll) {
            onScroll(originalIndex);
          }
        }
      } catch (error) {
        console.warn('Spot press error:', error);
      }
    },
    [onSpotSelect, onScroll, spots]
  );

  // Render panel header
  const renderHeader = () => (
    <View
      className="bg-[#2F6E77] shadow-lg"
      style={{
        borderTopLeftRadius: 30, // Increased from 40 for more curve
        borderTopRightRadius: 30, // Increased from 40 for more curve
      }}>
      {/* Drag Handle and Title Area - Both draggable */}
      <GestureDetector gesture={panGesture}>
        <View>
          {/* Drag Handle */}
          <View className="items-center py-4">
            <View
              className="bg-gray-300"
              style={{
                height: 4,
                width: 57,
                borderRadius: 20,
              }}
            />
          </View>

          {/* Panel Title */}
          <View className="px-6 pb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-white">Parking Spots</Text>
                <Text className="text-sm text-white">
                  {sortedSpots.length} locations found
                  {activeFilter && (
                    <Text className="text-xs text-gray-200">
                      {' '}
                      • Sorted by{' '}
                      {FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label || activeFilter}
                    </Text>
                  )}
                </Text>
              </View>

              {/* Navigation Status */}
              {isNavigating && (
                <View className="rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-sm font-medium text-blue-600">
                    {navigationState === 'calculating' ? 'Calculating...' : 'Navigating'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </GestureDetector>

      {/* Filter/Sort Options - Not draggable */}
      <View className="px-6 pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 0,
            alignItems: 'center',
            paddingRight: 16,
          }}
          style={{ flexGrow: 0 }}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              className={`mr-2 rounded-full px-3 py-2 ${
                activeFilter === option.key ? 'bg-green-500 shadow-sm' : 'bg-white shadow-sm'
              }`}
              onPress={() => handleFilterPress(option.key)}
              activeOpacity={0.7}>
              <View className="flex-row items-center">
                <Text className="mr-1 text-xs">{option.icon}</Text>
                <Text
                  className={`text-xs ${
                    activeFilter === option.key
                      ? 'font-semibold text-white'
                      : 'font-medium text-gray-700'
                  }`}>
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {activeFilter && (
            <TouchableOpacity
              className="mr-2 rounded-full bg-red-100 px-3 py-2"
              onPress={() => handleFilterPress(null)}
              activeOpacity={0.7}>
              <Text className="text-xs font-medium text-red-600">✕ Reset</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-lg text-gray-400">🅿️</Text>
      <Text className="mt-2 text-base text-gray-500">No parking spots found</Text>
      <Text className="mt-1 text-sm text-gray-400">Try adjusting your search or location</Text>
    </View>
  );

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          zIndex: 25,
          backgroundColor: 'transparent',
          // Add subtle shadow for better depth
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 10,
        },
        animatedStyle,
      ]}>
      <View
        className="flex-1"
        style={{
          borderTopLeftRadius: 30, // Match header radius
          borderTopRightRadius: 30, // Match header radius
          overflow: 'hidden', // Ensure content follows the curve
        }}>
        {renderHeader()}

        {/* Content Area */}
        <View className="flex-1 bg-[#2F6E77]">
          {sortedSpots.length === 0 ? (
            renderEmptyState()
          ) : (
            <ScrollView
              ref={scrollViewRef}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 100, // Extra space at bottom
              }}
              scrollEventThrottle={16}
              bounces={false}
              overScrollMode="never"
              nestedScrollEnabled={true}>
              {sortedSpots.map((spot, sortedIndex) => {
                try {
                  // Find if this spot is the selected one
                  const originalIndex = spots.findIndex((s) => s.id === spot.id);
                  const isSelected = originalIndex === selectedIndex;

                  return (
                    <View key={spot.id} style={{ marginBottom: 12 }}>
                      <ParkingSpotCard
                        spot={spot}
                        isSelected={isSelected}
                        onPress={() => handleSpotPress(sortedIndex, spot)}
                        onStartNavigation={() => onStartNavigation?.(originalIndex, spot)}
                        isNavigating={isNavigating}
                        navigationState={navigationState}
                        showNavigationButton={isSelected}
                      />
                    </View>
                  );
                } catch (error) {
                  console.warn('Error rendering spot card:', error);
                  return null;
                }
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

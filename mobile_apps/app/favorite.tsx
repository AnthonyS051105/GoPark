import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import { useParking } from '../contexts/ParkingContext';
import { ParkingSpot } from '../data/parkingData';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const formatDistance = (distance: number): string =>
  distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`;

const Favorite: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('favorite');
  const { spots, favorites, toggleFavorite } = useParking();

  const favoriteSpots = useMemo(
    () => spots.filter((spot) => favorites.includes(spot.id)),
    [spots, favorites]
  );

  const handleTabPress = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);

      switch (tabId) {
        case 'home':
        case 'parking':
          router.push('/dashboard');
          break;
        case 'favorite':
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

  const handleSelectSpot = (spot: ParkingSpot) => {
    router.push({ pathname: '/dashboard', params: { focusSpotId: String(spot.id) } });
  };

  const renderFavoriteItem = (spot: ParkingSpot) => (
    <TouchableOpacity
      key={spot.id}
      onPress={() => handleSelectSpot(spot)}
      activeOpacity={0.8}
      className="mx-6 mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center">
        {/* Parking Image */}
        <View className="mr-4 h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
          <Image
            source={require('../assets/icons/car.png')}
            className="h-8 w-8"
            style={{ tintColor: '#666666' }}
            resizeMode="contain"
          />
        </View>

        {/* Parking Info */}
        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {spot.available} spaces available
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-3 text-sm font-semibold text-gray-900">
                {formatPrice(spot.hourlyRate)}
              </Text>
              <TouchableOpacity onPress={() => toggleFavorite(spot.id)} activeOpacity={0.7}>
                <Image
                  source={require('../assets/icons/love.png')}
                  className="h-5 w-5"
                  style={{ tintColor: '#EF4444' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mb-1 text-lg font-semibold text-gray-900">{spot.name}</Text>

          <View className="flex-row items-center">
            <Text className="mr-3 text-sm text-gray-600">{formatDistance(spot.distance)}</Text>
            <View className="flex-row items-center">
              <Image
                source={require('../assets/icons/Vector.png')}
                className="mr-1 h-3 w-3"
                style={{ tintColor: '#FFC107' }}
                resizeMode="contain"
              />
              <Text className="text-sm text-gray-600">{spot.rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Favorite" showBackButton={true} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {favoriteSpots.length === 0 ? (
          <View className="items-center px-8 py-16">
            <Text className="mb-2 text-5xl">🤍</Text>
            <Text className="text-base font-medium text-gray-700">No favorites yet</Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              Tap the heart icon on a parking spot to save it here.
            </Text>
          </View>
        ) : (
          favoriteSpots.map(renderFavoriteItem)
        )}

        {/* Bottom padding for navigation */}
        <View className="h-32" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default Favorite;

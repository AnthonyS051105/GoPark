import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/dashboard/BottomNavigation';

interface FavoriteItem {
  id: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  rating: number;
  price: string;
  image: any;
  isFavorite: boolean;
}

const Favorite: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('favorite');

  // Handle tab press
  const handleTabPress = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);

      switch (tabId) {
        case 'home':
        case 'parking':
          router.push('/dashboard');
          break;
        case 'favorite':
          // Already on favorite page
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

  // Sample data based on the UI design
  const favoriteData: FavoriteItem[] = [
    {
      id: '1',
      date: 'Today',
      time: '14:28',
      location: 'CCM Basement',
      distance: '0.5 km',
      rating: 4.7,
      price: 'Rp9.000',
      image: require('../assets/icons/car.png'), // Using car icon as placeholder
      isFavorite: true,
    },
    {
      id: '2',
      date: 'Today',
      time: '14:28',
      location: 'CCM Basement',
      distance: '0.5 km',
      rating: 4.7,
      price: 'Rp9.000',
      image: require('../assets/icons/car.png'),
      isFavorite: true,
    },
    {
      id: '3',
      date: 'Today',
      time: '14:28',
      location: 'CCM Basement',
      distance: '0.5 km',
      rating: 4.7,
      price: 'Rp9.000',
      image: require('../assets/icons/car.png'),
      isFavorite: true,
    },
    {
      id: '4',
      date: 'Today',
      time: '14:28',
      location: 'CCM Basement',
      distance: '0.5 km',
      rating: 4.7,
      price: 'Rp9.000',
      image: require('../assets/icons/car.png'),
      isFavorite: true,
    },
    {
      id: '5',
      date: 'Today',
      time: '14:28',
      location: 'CCM Basement',
      distance: '0.5 km',
      rating: 4.7,
      price: 'Rp9.000',
      image: require('../assets/icons/car.png'),
      isFavorite: true,
    },
  ];

  const handleToggleFavorite = (id: string) => {
    // Handle favorite toggle logic
    console.log('Toggle favorite for:', id);
  };

  const renderFavoriteItem = (item: FavoriteItem) => (
    <View key={item.id} className="mx-6 mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center">
        {/* Parking Image */}
        <View className="mr-4 h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
          <Image
            source={item.image}
            className="h-8 w-8"
            style={{ tintColor: '#666666' }}
            resizeMode="contain"
          />
        </View>

        {/* Parking Info */}
        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-xs text-gray-500">
              {item.date}, {item.time}
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-3 text-sm font-semibold text-gray-900">{item.price}</Text>
              <TouchableOpacity onPress={() => handleToggleFavorite(item.id)} activeOpacity={0.7}>
                <Image
                  source={require('../assets/icons/love.png')}
                  className="h-5 w-5"
                  style={{ tintColor: item.isFavorite ? '#EF4444' : '#9CA3AF' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mb-1 text-lg font-semibold text-gray-900">{item.location}</Text>

          <View className="flex-row items-center">
            <Text className="mr-3 text-sm text-gray-600">{item.distance}</Text>
            <View className="flex-row items-center">
              <Image
                source={require('../assets/icons/Vector.png')}
                className="mr-1 h-3 w-3"
                style={{ tintColor: '#FFC107' }}
                resizeMode="contain"
              />
              <Text className="text-sm text-gray-600">{item.rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Favorite" showBackButton={true} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {favoriteData.map(renderFavoriteItem)}

        {/* Bottom padding for navigation */}
        <View className="h-32" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default Favorite;

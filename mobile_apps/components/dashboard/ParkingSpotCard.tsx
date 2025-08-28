import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

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

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  isSelected?: boolean;
  onPress?: () => void;
  onStartNavigation?: () => void;
  isNavigating?: boolean;
  navigationState?: string;
  showNavigationButton?: boolean;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({
  spot,
  isSelected = false,
  onPress,
  onStartNavigation,
  isNavigating = false,
  navigationState = 'idle',
  showNavigationButton = false,
}) => {
  const getAvailabilityColor = () => {
    if (spot.available === 0) return 'text-red-500';
    if (spot.available <= 2) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getAvailabilityBg = () => {
    if (spot.available === 0) return 'bg-red-50 border-red-200';
    if (spot.available <= 2) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const formatDistance = (distance: number): string => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-xl border-2 p-4 shadow-sm ${
        isSelected ? 'border-blue-300 bg-blue-50 shadow-md' : 'border-gray-200 bg-white'
      }`}
      activeOpacity={0.7}>
      <View className="flex-row items-start justify-between">
        {/* Main Content */}
        <View className="mr-3 flex-1">
          {/* Spot Name */}
          <Text
            className={`mb-1 text-lg font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {spot.name || `CCM Basement`}
          </Text>

          {/* Location */}
          <View className="mb-2 flex-row">
            <Text
              className="flex-1 text-sm leading-5 text-gray-600"
              numberOfLines={2}
              ellipsizeMode="tail">
              {spot.address ||
                'Parking location available near your destination with convenient access and security features'}
            </Text>
          </View>

          {/* Distance and Price */}
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={require('../../assets/icons/arrow.png')}
                className="mr-1 h-4 w-4 opacity-60"
                resizeMode="contain"
              />
              <Text className="text-sm text-gray-500">{formatDistance(spot.distance || 500)}</Text>
            </View>

            <Text className="font-semibold text-gray-900">
              {formatPrice(spot.hourlyRate || 5000)}/hour
            </Text>
          </View>

          {/* Availability Status */}
          <View className={`rounded-lg border ${getAvailabilityBg()}`}>
            <View className="flex-row items-center justify-center py-2">
              <Image
                source={require('../../assets/icons/car.png')}
                className="mr-2 h-4 w-4 opacity-80"
                resizeMode="contain"
              />
              <Text className={`font-medium ${getAvailabilityColor()}`}>
                {spot.available} spaces available
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="items-end">
          {showNavigationButton && !isNavigating && (
            <TouchableOpacity
              onPress={onStartNavigation}
              className="flex-row items-center rounded-lg bg-blue-600 px-4 py-2"
              activeOpacity={0.8}>
              <Image
                source={require('../../assets/icons/arrow.png')}
                className="tint-white mr-2 h-4 w-4"
                resizeMode="contain"
                style={{ tintColor: 'white' }}
              />
              <Text className="text-sm font-medium text-white">Navigate</Text>
            </TouchableOpacity>
          )}

          {isNavigating && isSelected && (
            <View className="flex-row items-center rounded-lg bg-green-600 px-4 py-2">
              <View className="mr-2 h-3 w-3 rounded-full bg-white" />
              <Text className="text-sm font-medium text-white">
                {navigationState === 'calculating' ? 'Calculating...' : 'Navigating'}
              </Text>
            </View>
          )}

          {!showNavigationButton && !isNavigating && (
            <View className="items-center">
              {/* Rating */}
              <View className="mb-2 flex-row items-center">
                <Text className="mr-1 text-sm text-yellow-500">⭐</Text>
                <Text className="text-sm text-gray-600">{spot.rating || '4.5'}</Text>
              </View>

              {/* Quick Actions */}
              <View className="flex-row space-x-2">
                <TouchableOpacity className="rounded-lg bg-gray-100 p-2">
                  <Image
                    source={require('../../assets/icons/love.png')}
                    className="h-4 w-4 opacity-60"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity className="rounded-lg bg-gray-100 p-2">
                  <Image
                    source={require('../../assets/icons/history.png')}
                    className="h-4 w-4 opacity-60"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Additional Info */}
      {isSelected && (
        <View className="mt-3 border-t border-gray-200 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="mr-4 flex-1 flex-row justify-between">
              {/* Operating Hours */}
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Hours</Text>
                <Text className="text-sm font-medium text-gray-900">{spot.hours || '24/7'}</Text>
              </View>

              {/* Payment Methods */}
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Payment</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {spot.paymentMethods?.join(', ') || 'Cash, Card'}
                </Text>
              </View>
            </View>

            {/* More Info Button */}
            <TouchableOpacity className="rounded-lg bg-gray-100 px-3 py-2">
              <Text className="text-sm text-gray-600">More Info</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          {spot.features && spot.features.length > 0 && (
            <View className="mt-3">
              <Text className="mb-2 text-xs text-gray-500">Features</Text>
              <View className="flex-row flex-wrap">
                {spot.features.map((feature, index) => (
                  <View key={index} className="mb-1 mr-2 rounded-full bg-blue-100 px-2 py-1">
                    <Text className="text-xs text-blue-600">{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ParkingSpotCard;

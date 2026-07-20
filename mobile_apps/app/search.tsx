import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import { useParking } from '../contexts/ParkingContext';
import { filterSpotsBySearch, sortSpotsByDistance, ParkingSpot } from '../data/parkingData';

const SEARCH_SUGGESTIONS = ['Mall', 'Rumah Sakit', 'Sekolah', 'Bandara', 'Hotel'];

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { spots } = useParking();
  const [searchText, setSearchText] = useState('');

  const results = useMemo(() => {
    return sortSpotsByDistance(filterSpotsBySearch(spots, searchText));
  }, [spots, searchText]);

  const handleSearch = () => {
    // Filtering happens live via `results`; kept for onSubmitEditing compatibility.
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
  };

  const handleSelectSpot = (spot: ParkingSpot) => {
    router.push({ pathname: '/dashboard', params: { focusSpotId: String(spot.id) } });
  };

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Search"
        showBackButton={true}
        showSearchBar={true}
        searchValue={searchText}
        onSearchChange={setSearchText}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search here"
      />

      {/* Content Area */}
      <View className="flex-1 px-5 pt-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Suggestions */}
          <View className="mb-8">
            <Text className="mb-4 text-base font-medium text-gray-800">
              Apakah ini yang kamu cari?
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className="rounded-full bg-gray-200 px-4 py-2"
                  activeOpacity={0.7}>
                  <Text className="text-sm text-gray-700">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recommendations */}
          <View className="mb-6">
            <View className="mb-4 rounded-lg bg-gray-100 px-4 py-3">
              <Text className="text-center text-base font-medium text-gray-800">
                {searchText ? `Results for "${searchText}"` : 'Rekomendasi'}
              </Text>
            </View>

            {results.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-base text-gray-500">No parking spots found</Text>
                <Text className="mt-1 text-sm text-gray-400">Try a different search term</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {results.map((spot) => (
                  <TouchableOpacity
                    key={spot.id}
                    onPress={() => handleSelectSpot(spot)}
                    className="flex-row items-center rounded-lg bg-gray-50 px-4 py-4 shadow-sm"
                    activeOpacity={0.7}>
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                      <Image
                        source={require('../assets/icons/car.png')}
                        className="h-5 w-5"
                        style={{ tintColor: '#666666' }}
                        resizeMode="contain"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-gray-800">{spot.name}</Text>
                      <Text className="text-xs text-gray-500" numberOfLines={1}>
                        {spot.address}
                      </Text>
                    </View>
                    <Text className="ml-2 text-sm font-semibold text-gray-700">
                      {formatPrice(spot.hourlyRate)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SearchPage;

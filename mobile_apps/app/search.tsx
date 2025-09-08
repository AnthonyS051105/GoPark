import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../utils/styles';

const SearchPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const searchSuggestions = ['Mall', 'Rumah Sakit', 'Sekolah', 'Bandara', 'Hotel'];

  const recommendations = [
    'CCM Basement',
    'CCM Basement',
    'CCM Basement',
    'CCM Basement',
    'CCM Basement',
    'CCM Basement',
    'CCM Basement',
  ];

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchText);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
    handleSearch();
  };

  return (
    <View className="flex-1 bg-[#2F6E77]">
      <StatusBar backgroundColor="#2F6E77" barStyle="light-content" />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="mt-2 flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={handleBack} className="-ml-2 mr-4 p-2">
            <Image
              source={require('../assets/icons/back.png')}
              className="h-6 w-6"
              style={{
                tintColor: COLORS.text.white,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white">Search</Text>
        </View>

        {/* Search Bar */}
        <View className="mx-5 mb-6">
          <View className="flex-row items-center rounded-full bg-white px-4 py-3 shadow-lg">
            <Image
              source={require('../assets/icons/search-location.png')}
              className="mr-3 h-5 w-5"
              style={{ tintColor: '#666' }}
              resizeMode="contain"
            />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search here"
              placeholderTextColor="#999"
              className="flex-1 text-base text-gray-800"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus={true}
            />
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 rounded-t-3xl bg-white px-5 pt-6">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search Suggestions */}
            <View className="mb-8">
              <Text className="mb-4 text-base font-medium text-gray-800">
                Apakah ini yang kamu cari?
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {searchSuggestions.map((suggestion, index) => (
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
                <Text className="text-center text-base font-medium text-gray-800">Rekomendasi</Text>
              </View>

              <View className="space-y-3">
                {recommendations.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="rounded-lg bg-gray-50 px-4 py-4 shadow-sm"
                    activeOpacity={0.7}>
                    <Text className="text-base text-gray-800">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SearchPage;

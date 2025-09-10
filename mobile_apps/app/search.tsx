import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/layout/Header';

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

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchText);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
    handleSearch();
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
    </View>
  );
};

export default SearchPage;

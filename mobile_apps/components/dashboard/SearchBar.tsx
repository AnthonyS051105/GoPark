import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../../utils/styles';

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search here', onPress }) => {
  const handleSearchBarPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/search');
    }
  };
  return (
    <View className="absolute left-5 right-5 top-16 z-20">
      <TouchableOpacity onPress={handleSearchBarPress} activeOpacity={0.8}>
        <View className="flex-row items-center rounded-full border border-[#2F6E77] bg-[#2F6E77] px-4 py-4 shadow-lg">
          {/* Search Icon */}
          <Image
            source={require('../../assets/icons/search-location.png')}
            className="ml-3 mr-5 h-5 w-5"
            resizeMode="contain"
          />

          {/* Text Input (disabled for touch) */}
          <View className="flex-1">
            <Text className="text-base italic text-white opacity-70">{placeholder}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

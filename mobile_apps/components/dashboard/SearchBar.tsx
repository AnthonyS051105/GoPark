import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../utils/styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search here',
}) => {
  return (
    <View className="absolute left-5 right-5 top-16 z-20">
      <View className="flex-row items-center rounded-full border border-[#2F6E77] bg-[#2F6E77] px-4 py-1 shadow-lg">
        {/* Search Icon */}
        <Image
          source={require('../../assets/icons/search-location.png')}
          className="ml-3 mr-3 h-5 w-5"
          resizeMode="contain"
        />

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.white}
          className="flex-1 text-base italic text-white"
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />

        {/* Search Button */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onSearch}
            className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-blue-600"
            activeOpacity={0.8}>
            <Image
              source={require('../../assets/icons/arrow.png')}
              className="h-4 w-4"
              style={{ tintColor: COLORS.text.white }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;

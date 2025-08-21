import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

interface LocationButtonProps {
  onPress: () => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-32 right-4 z-20 h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg"
      activeOpacity={0.8}>
      <Image
        source={require('../../assets/icons/search-location.png')}
        className="h-6 w-6"
        style={{ tintColor: '#3B82F6' }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default LocationButton;

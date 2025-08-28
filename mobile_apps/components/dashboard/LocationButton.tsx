import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface LocationButtonProps {
  onPress: () => void;
  panelHeight?: number;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onPress, panelHeight = 200 }) => {
  const BOTTOM_NAV_HEIGHT = 80; // Same as in DraggablePullUpPanel

  // Simple calculation: panel is at bottom: BOTTOM_NAV_HEIGHT
  // Panel has visible height: panelHeight
  // So button should be at: BOTTOM_NAV_HEIGHT + panelHeight + margin (positioned above the panel)
  const bottomPosition = useSharedValue(BOTTOM_NAV_HEIGHT + panelHeight + 20);

  // Update position smoothly when panelHeight changes
  React.useEffect(() => {
    const newBottomPosition = BOTTOM_NAV_HEIGHT + panelHeight + 20;
    console.log('LocationButton bottom position:', newBottomPosition, 'Panel height:', panelHeight);
    bottomPosition.value = withSpring(newBottomPosition, {
      damping: 15,
      stiffness: 200,
    });
  }, [panelHeight, bottomPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: bottomPosition.value,
    };
  });

  return (
    <Animated.View
      className="absolute right-4 z-30 h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg"
      style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        className="h-full w-full items-center justify-center rounded-full"
        activeOpacity={0.8}>
        <Image
          source={require('../../assets/icons/arrow.png')}
          className="h-6 w-6"
          style={{ tintColor: '#2F6E77' }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default LocationButton;

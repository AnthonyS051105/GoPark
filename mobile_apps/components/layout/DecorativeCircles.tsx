import React from 'react';
import { View, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface DecorativeCirclesProps {
  variant?: 'default' | 'top-left' | 'bottom-right' | 'scattered' | 'header-right';
  opacity?: number;
}

export default function DecorativeCircles({
  variant = 'default',
  opacity = 0.4,
}: DecorativeCirclesProps) {
  const renderCircles = () => {
    const baseStyle = {
      opacity,
    };

    switch (variant) {
      case 'header-right':
        return (
          <View className="absolute inset-0" style={baseStyle}>
            <View
              className="absolute rounded-full bg-[#5B9396]"
              style={{
                width: screenWidth * 0.4,
                height: screenWidth * 0.4,
                right: screenWidth * 0.17,
                top: -screenWidth * 0.15,
              }}
            />
            <View
              className="absolute rounded-full bg-[#5B9396]"
              style={{
                width: screenWidth * 0.4,
                height: screenWidth * 0.4,
                right: -screenWidth * 0.1,
                top: -screenWidth * 0.05,
              }}
            />
          </View>
        );

      case 'top-left':
        return (
          <View className="absolute inset-0" style={baseStyle}>
            <View
              className="bg-primary-light absolute rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                left: screenWidth * 0.13,
                top: -screenWidth * 0.25,
              }}
            />
            <View
              className="bg-primary-light absolute rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                left: -screenWidth * 0.2,
                top: -screenWidth * 0.15,
              }}
            />
          </View>
        );

      case 'bottom-right':
        return (
          <View className="absolute inset-0" style={baseStyle}>
            <View
              className="bg-primary-dark absolute rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                right: -screenWidth * 0.28,
                bottom: -screenWidth * 0.1,
              }}
            />
            <View
              className="bg-primary-dark absolute rounded-full"
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                right: -screenWidth * 0.001,
                bottom: -screenWidth * 0.3,
              }}
            />
          </View>
        );

      case 'scattered':
        return (
          <View className="absolute inset-0" style={baseStyle}>
            <View
              className="bg-primary-light absolute rounded-full"
              style={{
                width: screenWidth * 0.3,
                height: screenWidth * 0.3,
                left: screenWidth * 0.1,
                top: screenWidth * 0.2,
              }}
            />
            <View
              className="bg-primary-dark absolute rounded-full"
              style={{
                width: screenWidth * 0.4,
                height: screenWidth * 0.4,
                right: screenWidth * 0.05,
                top: screenWidth * 0.5,
              }}
            />
            <View
              className="bg-primary-light absolute rounded-full"
              style={{
                width: screenWidth * 0.25,
                height: screenWidth * 0.25,
                left: screenWidth * 0.6,
                bottom: screenWidth * 0.3,
              }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return renderCircles();
}

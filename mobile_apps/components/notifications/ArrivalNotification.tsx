import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';

interface ArrivalNotificationProps {
  parkingName: string;
  isVisible: boolean;
  onDismiss: () => void;
  onNavigateToLiveParking: () => void;
}

const ArrivalNotification: React.FC<ArrivalNotificationProps> = ({
  parkingName,
  isVisible,
  onDismiss,
  onNavigateToLiveParking,
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  const handleDismiss = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  }, [slideAnim, onDismiss]);

  useEffect(() => {
    if (isVisible) {
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim, handleDismiss]);

  const handleNavigateToLiveParking = () => {
    handleDismiss();
    setTimeout(() => {
      onNavigateToLiveParking();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: [{ translateY: slideAnim }],
        paddingTop: 50, // Account for status bar
        paddingHorizontal: 16,
      }}>
      <View
        style={{
          backgroundColor: '#2F6E77',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <Image
                source={require('../../assets/icons/car.png')}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: 'white',
                }}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 2,
                }}>
                You&apos;ve Arrived!
              </Text>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 12,
                }}>
                {parkingName}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleDismiss} style={{ padding: 4 }}>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              ×
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 14,
            marginBottom: 16,
            lineHeight: 20,
          }}>
          Check real-time parking availability and live footage of the parking area.
        </Text>

        {/* Actions */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
          }}>
          <TouchableOpacity
            onPress={handleDismiss}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Dismiss
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNavigateToLiveParking}
            style={{
              flex: 1,
              backgroundColor: 'white',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#2F6E77',
                fontSize: 14,
                fontWeight: '600',
              }}>
              View Live
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default ArrivalNotification;

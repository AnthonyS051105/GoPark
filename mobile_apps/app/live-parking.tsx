import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import LiveFootage from '../components/live-parking/LiveFootage';
import ParkingLevelSelector from '../components/live-parking/ParkingLevelSelector';
import LevelInfoDisplay from '../components/live-parking/LevelInfoDisplay';

interface ParkingLevel {
  id: string;
  name: string;
  available: boolean;
  spots?: {
    total: number;
    occupied: number;
    available: number;
  };
}

export default function LiveParkingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('parking');
  const [selectedLevel, setSelectedLevel] = useState('upper-basement');

  // Mock data for parking levels
  const parkingLevels: ParkingLevel[] = [
    {
      id: 'upper-basement',
      name: 'Upper Basement',
      available: true,
      spots: { total: 150, occupied: 45, available: 105 },
    },
    {
      id: 'lower-basement',
      name: 'Lower Basement',
      available: true,
      spots: { total: 200, occupied: 180, available: 20 },
    },
    {
      id: 'basement-1',
      name: 'Basement',
      available: true,
      spots: { total: 100, occupied: 60, available: 40 },
    },
    {
      id: 'basement-2',
      name: 'Basement',
      available: true,
      spots: { total: 120, occupied: 60, available: 60 },
    },
    {
      id: 'basement-3',
      name: 'Basement',
      available: true,
      spots: { total: 80, occupied: 50, available: 30 },
    },
  ];

  // Current time for closing information
  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Handle tab press
  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);

    switch (tabId) {
      case 'home':
        router.push('/dashboard');
        break;
      case 'favorite':
        router.push('/favorite');
        break;
      case 'parking':
        // Stay on live parking page
        break;
      case 'history':
        router.push('/history');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Stack.Screen
        options={{
          title: 'Live Parking',
          headerShown: false,
        }}
      />

      {/* Header */}
      <Header title="Live Parking" showBackButton={true} />

      {/* Main Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Pakuwon Basement Section */}
        <View style={{ margin: 16 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
            {/* Section Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#2F6E77',
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#1f2937',
                  flex: 1,
                }}>
                Pakuwon Basement
              </Text>
            </View>

            {/* Live Footage Area */}
            <View style={{ marginBottom: 16 }}>
              <LiveFootage parkingLocation="Pakuwon Basement" height={220} />
            </View>

            {/* Live Footage Label */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#ef4444',
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#374151',
                }}>
                Live Footage
              </Text>
            </View>
          </View>
        </View>

        {/* Pakuwon Parking Level Section */}
        <View style={{ margin: 16, marginTop: 0 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
            {/* Section Title */}
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Poppins-Bold',
                color: '#1f2937',
                marginBottom: 10,
                marginTop: 5,
              }}>
              Pakuwon Parking Level
            </Text>

            {/* Level Selector */}
            <ParkingLevelSelector
              levels={parkingLevels}
              selectedLevel={selectedLevel}
              onLevelSelect={setSelectedLevel}
            />

            {/* Selected Level Info */}
            {selectedLevel &&
              (() => {
                const level = parkingLevels.find((l) => l.id === selectedLevel);
                if (!level || !level.spots) return null;

                return (
                  <LevelInfoDisplay
                    levelName={level.name}
                    spots={level.spots}
                    isAvailable={level.available}
                  />
                );
              })()}
          </View>
        </View>

        {/* Closing Time Information */}
        <View
          style={{
            margin: 16,
            marginTop: 0,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}>
          <Image
            source={require('../assets/icons/clock.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: '#6b7280',
              marginRight: 12,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: '#374151',
              fontSize: 14,
              fontWeight: '500',
            }}>
            Jam Tutup : {formatTime(new Date(2024, 11, 12, 21, 30))}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

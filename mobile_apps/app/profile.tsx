import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/dashboard/BottomNavigation';

const Profile: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile pressed');
  };

  // Handle tab press
  const handleTabPress = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);

      switch (tabId) {
        case 'home':
        case 'parking':
          router.push('/dashboard');
          break;
        case 'favorite':
          router.push('/favorite');
          break;
        case 'history':
          router.push('/history');
          break;
        case 'profile':
          // Already on profile page
          break;
        default:
          break;
      }
    },
    [router]
  );

  // Profile data for the header
  const profileData = {
    name: 'Anthony',
    email: 'yohanesanthony@gmail.com',
    phone: '+62 81234567892',
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header
        title="Profile"
        showBackButton={true}
        showProfileCard={true}
        profileData={profileData}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Empty Cards - placeholder for future content */}
        <View className="mx-6 mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <View className="h-24 items-center justify-center rounded-lg border border-dashed border-gray-200">
            <Text className="text-sm text-gray-400">Content placeholder</Text>
          </View>
        </View>

        <View className="mx-6 mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <View className="h-24 items-center justify-center rounded-lg border border-dashed border-gray-200">
            <Text className="text-sm text-gray-400">Content placeholder</Text>
          </View>
        </View>

        <View className="mx-6 mb-32 mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <View className="h-24 items-center justify-center rounded-lg border border-dashed border-gray-200">
            <Text className="text-sm text-gray-400">Content placeholder</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default Profile;

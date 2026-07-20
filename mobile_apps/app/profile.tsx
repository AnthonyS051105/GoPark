import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import { useAuth } from '../contexts/AuthContext';
import { useParking } from '../contexts/ParkingContext';

const Profile: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout, updateProfile } = useAuth();
  const { bookings, favorites } = useParking();

  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState(user?.fullName ?? '');
  const [editPhone, setEditPhone] = useState(user?.phoneNumber ?? '');

  const activeBookings = bookings.filter((b) => b.status === 'active').length;

  const handleEditProfile = () => {
    setEditName(user?.fullName ?? '');
    setEditPhone(user?.phoneNumber ?? '');
    setEditVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    await updateProfile({ fullName: editName.trim(), phoneNumber: editPhone.trim() });
    setEditVisible(false);
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

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
          break;
        default:
          break;
      }
    },
    [router]
  );

  const profileData = {
    name: user?.fullName ?? 'Guest',
    email: user?.email ?? '',
    phone: user?.phoneNumber ?? '-',
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
        {/* Stats */}
        <View className="mx-6 mt-4 flex-row rounded-2xl bg-white p-6 shadow-sm">
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="text-2xl font-bold text-[#2F6E77]">{bookings.length}</Text>
            <Text className="text-xs text-gray-500">Total Bookings</Text>
          </View>
          <View className="flex-1 items-center border-r border-gray-100">
            <Text className="text-2xl font-bold text-[#2F6E77]">{activeBookings}</Text>
            <Text className="text-xs text-gray-500">Active</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-[#2F6E77]">{favorites.length}</Text>
            <Text className="text-xs text-gray-500">Favorites</Text>
          </View>
        </View>

        {/* Account */}
        <View className="mx-6 mt-4 rounded-2xl bg-white p-2 shadow-sm">
          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-4"
            onPress={handleEditProfile}
            activeOpacity={0.7}>
            <Text className="text-base text-gray-800">Edit Profile</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
          <View className="h-px bg-gray-100" />
          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-4"
            onPress={() => router.push('/history')}
            activeOpacity={0.7}>
            <Text className="text-base text-gray-800">Booking History</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
          <View className="h-px bg-gray-100" />
          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-4"
            onPress={() =>
              Alert.alert('GoPark', 'GoPark v1.0 — Find and book parking spots easily.')
            }
            activeOpacity={0.7}>
            <Text className="text-base text-gray-800">About & Help</Text>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="mx-6 mb-32 mt-4 rounded-2xl bg-white p-2 shadow-sm">
          <TouchableOpacity
            className="items-center px-4 py-4"
            onPress={handleLogout}
            activeOpacity={0.7}>
            <Text className="text-base font-semibold text-red-500">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editVisible} animationType="slide" transparent onRequestClose={() => setEditVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <Text className="mb-4 text-lg font-bold text-gray-900">Edit Profile</Text>

            <Text className="mb-1 text-sm text-gray-600">Full Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              className="mb-4 rounded-xl bg-gray-100 px-4 py-3 text-gray-900"
              placeholder="Full name"
            />

            <Text className="mb-1 text-sm text-gray-600">Phone Number</Text>
            <TextInput
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
              className="mb-6 rounded-xl bg-gray-100 px-4 py-3 text-gray-900"
              placeholder="Phone number"
            />

            <TouchableOpacity
              onPress={handleSaveProfile}
              activeOpacity={0.85}
              className="mb-3 items-center rounded-2xl bg-[#2F6E77] py-4">
              <Text className="text-base font-semibold text-white">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditVisible(false)}
              activeOpacity={0.7}
              className="items-center py-2">
              <Text className="text-sm text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default Profile;

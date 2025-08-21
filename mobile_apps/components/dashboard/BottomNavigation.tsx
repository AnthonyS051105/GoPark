import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: require('../../assets/icons/home.png'),
    },
    {
      id: 'favorite',
      label: 'Favorite',
      icon: require('../../assets/icons/love.png'),
    },
    {
      id: 'parking',
      label: 'Parking',
      icon: require('../../assets/icons/car.png'),
    },
    {
      id: 'history',
      label: 'History',
      icon: require('../../assets/icons/history.png'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: require('../../assets/icons/user-alt.png'),
    },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg">
      <View className="pb-safe flex-row items-center justify-around py-2">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}>
            <View
              className={`mb-1 h-10 w-10 items-center justify-center rounded-2xl ${
                activeTab === tab.id ? 'bg-blue-600' : 'bg-transparent'
              }`}>
              <Image
                source={tab.icon}
                className="h-6 w-6"
                style={{
                  tintColor: activeTab === tab.id ? '#ffffff' : '#6B7280',
                }}
                resizeMode="contain"
              />
            </View>
            <Text
              className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;

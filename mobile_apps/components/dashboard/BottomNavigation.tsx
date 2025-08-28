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
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-lg"
      style={{
        zIndex: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}>
      <View className="pb-safe flex-row items-center justify-center px-4 py-2">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className={`items-center py-1 ${index < tabs.length - 1 ? 'mr-4' : ''}`}
            style={{ minWidth: 60 }}
            activeOpacity={0.7}>
            <View
              style={{
                width: activeTab === tab.id ? 68 : 50,
                height: activeTab === tab.id ? 68 : 50,
                backgroundColor: activeTab === tab.id ? '#2F6E77' : 'transparent',
                borderRadius: activeTab === tab.id ? 34 : 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: activeTab === tab.id ? -8 : 0,
                shadowColor: activeTab === tab.id ? '#2F6E77' : 'transparent',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: activeTab === tab.id ? 8 : 0,
              }}>
              <Image
                source={tab.icon}
                style={{
                  tintColor: activeTab === tab.id ? '#ffffff' : '#000000',
                  width: activeTab === tab.id ? 34 : 26,
                  height: activeTab === tab.id ? 34 : 26,
                }}
                resizeMode="contain"
              />
            </View>
            {activeTab !== tab.id && (
              <Text className="mt-1 text-xs font-medium text-gray-500">{tab.label}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../utils/styles';
import DecorativeCircles from './DecorativeCircles';

interface ProfileCardData {
  name: string;
  email: string;
  phone: string;
}

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  // Search related props
  showSearchBar?: boolean;
  onSearchChange?: (text: string) => void;
  onSearchSubmit?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  // Profile related props
  showProfileCard?: boolean;
  profileData?: ProfileCardData;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightElement,
  showSearchBar = false,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search here',
  searchValue = '',
  showProfileCard = false,
  profileData,
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState(searchValue);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  const handleSearchSubmit = () => {
    onSearchSubmit?.();
  };

  return (
    <View className="">
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />

      {/* Header with curved bottom */}
      <View className="relative">
        <View className="overflow-hidden bg-[#2F6E77]">
          {/* Decorative Circles - positioned to cover status bar area */}
          <DecorativeCircles variant="header-right" />
          overflow-hidden
          <SafeAreaView>
            {/* Header Content */}
            <View className="flex-row items-center px-5 pb-2 pt-8">
              {showBackButton && (
                <TouchableOpacity onPress={() => router.back()} className="-ml-2 mr-4 mt-6 p-2">
                  <Image
                    source={require('../../assets/icons/back.png')}
                    className="h-6 w-6"
                    style={{
                      tintColor: COLORS.text.white,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
              <Text className="mt-6 text-xl font-semibold text-white">{title}</Text>
              {rightElement && <View className="ml-auto mt-6">{rightElement}</View>}
            </View>

            {/* Search Bar */}
            {showSearchBar && (
              <View className="mx-5 mb-2">
                <View className="flex-row items-center rounded-full bg-white px-4 py-3 shadow-lg">
                  <Image
                    source={require('../../assets/icons/search-location.png')}
                    className="mr-3 h-5 w-5"
                    style={{ tintColor: '#666' }}
                    resizeMode="contain"
                  />
                  <TextInput
                    value={searchText}
                    onChangeText={handleSearchChange}
                    placeholder={searchPlaceholder}
                    placeholderTextColor="#999"
                    className="flex-1 text-base text-gray-800"
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                    autoFocus={true}
                  />
                </View>
              </View>
            )}

            {/* Profile Card */}
            {showProfileCard && profileData && (
              <View className="mx-5 mb-2">
                <View className="rounded-2xl bg-white p-6 shadow-lg">
                  <View className="flex-row items-center">
                    {/* Profile Image */}
                    <View className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                      <Image
                        source={require('../../assets/icons/user-alt.png')}
                        className="h-8 w-8"
                        style={{ tintColor: '#ffffff' }}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Profile Info */}
                    <View className="flex-1">
                      <Text className="mb-1 text-lg font-semibold text-gray-900">
                        {profileData.name}
                      </Text>
                      <Text className="mb-1 text-sm text-gray-600">{profileData.email}</Text>
                      <Text className="text-sm text-gray-600">{profileData.phone}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>

        {/* Curved bottom shape using View */}
        <View className="rounded-b-full bg-[#2F6E77] py-3" />
      </View>

      {/* Ensure white background continues */}
      <View className="h-4 bg-white" />
    </View>
  );
};

export default Header;

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/dashboard/BottomNavigation';
import { useParking, Booking, BookingStatus } from '../contexts/ParkingContext';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const formatDateTime = (iso: string): { date: string; time: string } => {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const date = isToday
    ? 'Today'
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
};

const STATUS_STYLES: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
  completed: { label: 'Completed', bg: 'bg-gray-200', text: 'text-gray-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-600' },
};

const History: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('history');
  const { bookings } = useParking();

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [bookings]
  );

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
          break;
        case 'profile':
          router.push('/profile');
          break;
        default:
          break;
      }
    },
    [router]
  );

  const handleSelectBooking = (booking: Booking) => {
    if (booking.status === 'active') {
      router.push({ pathname: '/dashboard', params: { focusSpotId: String(booking.spotId) } });
    }
  };

  const renderHistoryItem = (item: Booking) => {
    const { date, time } = formatDateTime(item.createdAt);
    const statusStyle = STATUS_STYLES[item.status];

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleSelectBooking(item)}
        activeOpacity={0.8}
        className="mx-6 mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <View className="flex-row items-center">
          {/* Parking Image */}
          <View className="mr-4 h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
            <Image
              source={require('../assets/icons/car.png')}
              className="h-8 w-8"
              style={{ tintColor: '#666666' }}
              resizeMode="contain"
            />
          </View>

          {/* Parking Info */}
          <View className="flex-1">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-xs text-gray-500">
                {date}, {time}
              </Text>
              <Text className="text-sm font-semibold text-gray-900">
                {formatPrice(item.totalPrice)}
              </Text>
            </View>

            <Text className="mb-1 text-lg font-semibold text-gray-900">{item.spotName}</Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">
                {item.durationHours}h · {item.paymentMethod}
              </Text>
              <View className={`rounded-full px-2 py-1 ${statusStyle.bg}`}>
                <Text className={`text-xs font-medium ${statusStyle.text}`}>
                  {statusStyle.label}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="History" showBackButton={true} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {sortedBookings.length === 0 ? (
          <View className="items-center px-8 py-16">
            <Text className="mb-2 text-5xl">🅿️</Text>
            <Text className="text-base font-medium text-gray-700">No bookings yet</Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              Book a parking spot from the dashboard to see it here.
            </Text>
          </View>
        ) : (
          sortedBookings.map(renderHistoryItem)
        )}

        {/* Bottom padding for navigation */}
        <View className="h-32" />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default History;

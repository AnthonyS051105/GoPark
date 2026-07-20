import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Booking } from '../../contexts/ParkingContext';

interface ActiveBookingBannerProps {
  booking: Booking;
  onFinish: () => void;
}

const formatRemaining = (booking: Booking): string => {
  const startedAt = new Date(booking.createdAt).getTime();
  const endsAt = startedAt + booking.durationHours * 60 * 60 * 1000;
  const remainingMs = Math.max(0, endsAt - Date.now());

  const totalMinutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (remainingMs === 0) return 'Time up';
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

const ActiveBookingBanner: React.FC<ActiveBookingBannerProps> = ({ booking, onFinish }) => {
  const [label, setLabel] = useState(() => formatRemaining(booking));

  useEffect(() => {
    const interval = setInterval(() => setLabel(formatRemaining(booking)), 30000);
    return () => clearInterval(interval);
  }, [booking]);

  return (
    <View
      className="absolute left-5 right-5 z-20 flex-row items-center justify-between rounded-2xl bg-[#2F6E77] px-4 py-3 shadow-lg"
      style={{ top: 100 }}>
      <View className="mr-3 flex-1">
        <Text className="text-xs text-white/80">Parking active</Text>
        <Text className="text-sm font-semibold text-white" numberOfLines={1}>
          {booking.spotName} · {label}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onFinish}
        activeOpacity={0.8}
        className="rounded-full bg-white px-3 py-2">
        <Text className="text-xs font-semibold text-[#2F6E77]">Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActiveBookingBanner;

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Booking } from '../../contexts/ParkingContext';

interface BookingSuccessModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  visible,
  booking,
  onClose,
}) => {
  if (!booking) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-8">
        <View className="w-full items-center rounded-3xl bg-white px-6 py-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Text className="text-3xl">✓</Text>
          </View>
          <Text className="mb-1 text-lg font-bold text-gray-900">Booking Confirmed!</Text>
          <Text className="mb-5 text-center text-sm text-gray-500">
            Your spot at {booking.spotName} is reserved for {booking.durationHours} hour(s).
          </Text>

          <View className="mb-6 w-full rounded-2xl bg-gray-50 p-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-sm text-gray-500">Location</Text>
              <Text className="text-sm font-medium text-gray-800">{booking.spotName}</Text>
            </View>
            <View className="mb-2 flex-row justify-between">
              <Text className="text-sm text-gray-500">Payment</Text>
              <Text className="text-sm font-medium text-gray-800">{booking.paymentMethod}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Total Paid</Text>
              <Text className="text-sm font-bold text-[#2F6E77]">
                {formatPrice(booking.totalPrice)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            className="w-full items-center rounded-2xl bg-[#2F6E77] py-4">
            <Text className="text-base font-semibold text-white">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BookingSuccessModal;

import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ParkingSpot } from '../../data/parkingData';

interface BookingModalProps {
  visible: boolean;
  spot: ParkingSpot | null;
  onClose: () => void;
  onConfirm: (durationHours: number, paymentMethod: string) => void;
}

const DURATION_OPTIONS = [1, 2, 3, 5];

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const BookingModal: React.FC<BookingModalProps> = ({ visible, spot, onClose, onConfirm }) => {
  const [durationHours, setDurationHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const paymentMethods = spot?.paymentMethods ?? ['Cash'];

  const total = useMemo(
    () => (spot ? spot.hourlyRate * durationHours : 0),
    [spot, durationHours]
  );

  if (!spot) return null;

  const selectedPayment = paymentMethod ?? paymentMethods[0];

  const handleConfirm = () => {
    onConfirm(durationHours, selectedPayment);
    setDurationHours(1);
    setPaymentMethod(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="rounded-t-3xl bg-white px-6 pb-8 pt-4"
          style={{ maxHeight: '85%' }}>
          {/* Drag handle */}
          <View className="mb-4 items-center">
            <View className="h-1 w-14 rounded-full bg-gray-300" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-1 text-xl font-bold text-gray-900">Book This Spot</Text>
            <Text className="mb-5 text-sm text-gray-500" numberOfLines={2}>
              {spot.name} · {spot.address}
            </Text>

            {/* Duration */}
            <Text className="mb-2 text-sm font-semibold text-gray-700">Duration</Text>
            <View className="mb-5 flex-row flex-wrap gap-2">
              {DURATION_OPTIONS.map((hours) => (
                <TouchableOpacity
                  key={hours}
                  onPress={() => setDurationHours(hours)}
                  activeOpacity={0.7}
                  className={`rounded-full px-4 py-2 ${
                    durationHours === hours ? 'bg-[#2F6E77]' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      durationHours === hours ? 'text-white' : 'text-gray-700'
                    }`}>
                    {hours}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment method */}
            <Text className="mb-2 text-sm font-semibold text-gray-700">Payment Method</Text>
            <View className="mb-5 flex-row flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  activeOpacity={0.7}
                  className={`rounded-full px-4 py-2 ${
                    selectedPayment === method ? 'bg-[#2F6E77]' : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      selectedPayment === method ? 'text-white' : 'text-gray-700'
                    }`}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary */}
            <View className="mb-6 rounded-2xl bg-gray-50 p-4">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm text-gray-500">Rate</Text>
                <Text className="text-sm text-gray-800">
                  {formatPrice(spot.hourlyRate)}/hour
                </Text>
              </View>
              <View className="mb-2 flex-row justify-between">
                <Text className="text-sm text-gray-500">Duration</Text>
                <Text className="text-sm text-gray-800">{durationHours} hour(s)</Text>
              </View>
              <View className="mt-1 flex-row justify-between border-t border-gray-200 pt-2">
                <Text className="text-base font-semibold text-gray-900">Total</Text>
                <Text className="text-base font-bold text-[#2F6E77]">{formatPrice(total)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.85}
              className="mb-3 items-center rounded-2xl bg-[#2F6E77] py-4">
              <Text className="text-base font-semibold text-white">Confirm & Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="items-center py-2">
              <Text className="text-sm text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default BookingModal;

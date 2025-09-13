import React from 'react';
import { View, Text } from 'react-native';

interface ParkingSpots {
  total: number;
  occupied: number;
  available: number;
}

interface LevelInfoDisplayProps {
  levelName: string;
  spots: ParkingSpots;
  isAvailable: boolean;
}

const LevelInfoDisplay: React.FC<LevelInfoDisplayProps> = ({ levelName, spots, isAvailable }) => {
  if (!isAvailable) {
    return (
      <View
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#fef2f2',
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: '#ef4444',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#991b1b',
            textAlign: 'center',
          }}>
          {levelName} - Currently Unavailable
        </Text>
      </View>
    );
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#22c55e'; // Green
    if (percentage > 20) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const availabilityPercentage = Math.round((spots.available / spots.total) * 100);
  const availabilityColor = getAvailabilityColor(spots.available, spots.total);

  return (
    <View
      style={{
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2F6E77',
      }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1f2937',
          }}>
          {levelName} - Status
        </Text>
        <View
          style={{
            backgroundColor: availabilityColor,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '600',
            }}>
            {availabilityPercentage}% Available
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#22c55e',
            }}>
            {spots.available}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#6b7280',
              fontWeight: '500',
            }}>
            Available
          </Text>
        </View>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#ef4444',
            }}>
            {spots.occupied}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#6b7280',
              fontWeight: '500',
            }}>
            Occupied
          </Text>
        </View>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#3b82f6',
            }}>
            {spots.total}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#6b7280',
              fontWeight: '500',
            }}>
            Total
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          backgroundColor: '#e5e7eb',
          height: 8,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
        <View
          style={{
            backgroundColor: '#ef4444',
            height: '100%',
            width: `${(spots.occupied / spots.total) * 100}%`,
          }}
        />
        <View
          style={{
            backgroundColor: '#22c55e',
            height: '100%',
            width: `${(spots.available / spots.total) * 100}%`,
            position: 'absolute',
            right: 0,
          }}
        />
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 8,
          gap: 16,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#ef4444',
              borderRadius: 2,
              marginRight: 4,
            }}
          />
          <Text style={{ fontSize: 10, color: '#6b7280' }}>Occupied</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#22c55e',
              borderRadius: 2,
              marginRight: 4,
            }}
          />
          <Text style={{ fontSize: 10, color: '#6b7280' }}>Available</Text>
        </View>
      </View>
    </View>
  );
};

export default LevelInfoDisplay;

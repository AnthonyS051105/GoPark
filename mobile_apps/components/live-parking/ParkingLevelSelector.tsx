import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ParkingLevel {
  id: string;
  name: string;
  available: boolean;
  spots?: {
    total: number;
    occupied: number;
    available: number;
  };
}

interface ParkingLevelSelectorProps {
  levels: ParkingLevel[];
  selectedLevel: string;
  onLevelSelect: (levelId: string) => void;
}

const ParkingLevelSelector: React.FC<ParkingLevelSelectorProps> = ({
  levels,
  selectedLevel,
  onLevelSelect,
}) => {
  // Split levels into groups for display
  const primaryLevels = levels.slice(0, 2); // Upper and Lower Basement
  const additionalLevels = levels.slice(2); // Other basement levels

  const renderLevelButton = (level: ParkingLevel, style: any = {}) => (
    <TouchableOpacity
      key={level.id}
      onPress={() => onLevelSelect(level.id)}
      disabled={!level.available}
      style={{
        backgroundColor: !level.available
          ? '#9ca3af'
          : selectedLevel === level.id
            ? '#219BA2'
            : '#909090',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        opacity: !level.available ? 0.6 : 1,
        ...style,
      }}>
      <Text
        style={{
          color: !level.available
            ? '#6b7280'
            : selectedLevel === level.id
              ? 'white'
              : 'white',
          fontWeight: '600',
          fontSize: 14,
        }}>
        {level.name}
      </Text>

      {/* Show availability indicator for selected level */}
      {selectedLevel === level.id && level.spots && level.available && (
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 10,
            marginTop: 2,
          }}>
          {level.spots.available} available
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Primary Level Buttons (Upper & Lower Basement) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        {primaryLevels.map((level, index) =>
          renderLevelButton(level, {
            flex: 1,
            marginRight: index === 0 ? 6 : 0,
            marginLeft: index === 1 ? 6 : 0,
          })
        )}
      </View>

      {/* Additional Level Buttons */}
      {additionalLevels.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {additionalLevels.map((level, index) =>
            renderLevelButton(level, {
              flex: 1,
              marginHorizontal: index === 1 ? 4 : 0,
            })
          )}
        </View>
      )}
    </View>
  );
};

export default ParkingLevelSelector;

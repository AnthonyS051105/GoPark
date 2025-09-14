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
        backgroundColor: selectedLevel === level.id ? '#219BA2' : '#909090',
        paddingHorizontal: 15,
        paddingVertical: 3,
        borderRadius: 8,
        alignItems: 'center',
        transform: [{ scale: selectedLevel === level.id ? 1.05 : 1 }],
        elevation: selectedLevel === level.id ? 8 : 2,
        shadowColor: selectedLevel === level.id ? '#219BA2' : '#000',
        shadowOffset: {
          width: 0,
          height: selectedLevel === level.id ? 4 : 2,
        },
        shadowOpacity: selectedLevel === level.id ? 0.3 : 0.1,
        shadowRadius: selectedLevel === level.id ? 6 : 3,
        ...style,
      }}>
      <Text
        style={{
          color: 'white',
          fontWeight: selectedLevel === level.id ? '600' : '500',
          fontSize: selectedLevel === level.id ? 14 : 13,
        }}>
        {level.name}
      </Text>
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

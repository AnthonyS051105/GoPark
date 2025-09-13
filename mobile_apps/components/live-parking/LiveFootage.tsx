import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

interface LiveFootageProps {
  parkingLocation: string;
  width?: number;
  height?: number;
  onConnectionStatusChange?: (connected: boolean) => void;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

const LiveFootage: React.FC<LiveFootageProps> = ({
  parkingLocation,
  width,
  height = 220,
  onConnectionStatusChange,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Simulate connection attempt
    const connectTimer = setTimeout(() => {
      // For now, simulate random connection success/failure
      const isConnected = Math.random() > 0.3; // 70% success rate

      if (isConnected) {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        onConnectionStatusChange?.(true);
      } else {
        setConnectionStatus('error');
        onConnectionStatusChange?.(false);

        // Attempt to reconnect
        if (reconnectAttempts < 3) {
          const reconnectTimer = setTimeout(() => {
            setConnectionStatus('connecting');
            setReconnectAttempts((prev) => prev + 1);
          }, 2000);

          return () => clearTimeout(reconnectTimer);
        } else {
          setConnectionStatus('disconnected');
        }
      }
    }, 1500);

    return () => clearTimeout(connectTimer);
  }, [reconnectAttempts, onConnectionStatusChange]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#22c55e'; // green
      case 'connecting':
        return '#f59e0b'; // yellow
      case 'error':
        return '#ef4444'; // red
      case 'disconnected':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live Stream Active';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return `Connection Failed (Attempt ${reconnectAttempts + 1}/3)`;
      case 'disconnected':
        return 'Unable to Connect';
      default:
        return 'Unknown Status';
    }
  };

  const renderContent = () => {
    if (connectionStatus === 'connected') {
      // TODO: In the future, this would render the actual video stream
      // For now, show a placeholder with simulated camera view
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <View
            style={{
              width: '90%',
              height: '80%',
              backgroundColor: '#1f2937',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#22c55e',
            }}>
            <Image
              source={require('../../assets/icons/cam.png')}
              style={{
                width: 32,
                height: 32,
                tintColor: '#22c55e',
                marginBottom: 8,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: '#22c55e',
                fontSize: 12,
                fontWeight: '600',
              }}>
              LIVE
            </Text>
            <Text
              style={{
                color: '#9ca3af',
                fontSize: 10,
                marginTop: 4,
              }}>
              {parkingLocation}
            </Text>
          </View>
        </View>
      );
    }

    // Default placeholder for other states
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        {connectionStatus === 'connecting' && (
          <ActivityIndicator size="large" color="#f59e0b" style={{ marginBottom: 16 }} />
        )}

        <Image
          source={require('../../assets/icons/cam.png')}
          style={{
            width: 48,
            height: 48,
            tintColor: '#6b7280',
            marginBottom: 8,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            color: '#6b7280',
            fontSize: 14,
            fontWeight: '500',
            textAlign: 'center',
          }}>
          Live Camera Feed
        </Text>

        <Text
          style={{
            color: getStatusColor(),
            fontSize: 12,
            marginTop: 4,
            textAlign: 'center',
          }}>
          {getStatusText()}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#9ca3af',
        borderRadius: 12,
        height,
        width,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      {renderContent()}

      {/* Status Indicator */}
      <View
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: getStatusColor(),
            marginRight: 6,
          }}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 10,
            fontWeight: '500',
          }}>
          {connectionStatus === 'connected' ? 'LIVE' : connectionStatus.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

export default LiveFootage;

import { useState } from 'react';
import { View } from 'react-native';
import { router, Slot } from 'expo-router';

import ConnectionOverlay from '@/components/connection/ConnectionOverlay';

type ConnectionStatus = 'connected' | 'reconnecting' | 'failed';

const PlayerLayout = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connected');

  const handleCancel = () => {
    setConnectionStatus('connected');
    router.replace('/');
  };

  const handleRetry = () => {
    setConnectionStatus('reconnecting');
  };

  return (
    <View className="flex-1">
      <Slot />

      {connectionStatus !== 'connected' && (
        <ConnectionOverlay
          connectionStatus={connectionStatus}
          onCancel={handleCancel}
          onRetry={handleRetry}
        />
      )}
    </View>
  );
};

export default PlayerLayout;
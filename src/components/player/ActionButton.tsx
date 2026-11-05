import { TouchableOpacity, Text } from 'react-native';
import * as Haptics from 'expo-haptics'; // 1. Importas Haptics

interface ActionButtonProps {
  symbol: string;
  bgColor: string;
  onPress: () => void;
}

const ActionButton = ({ symbol, bgColor, onPress }: ActionButtonProps) => {
  
  // 2. Creas el manejador con la vibración
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Ideal para botones pequeños o contadores
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} // 3. Usas tu manejador aquí
      className={`w-10 h-10 ${bgColor} rounded-xl items-center justify-center active:opacity-70`}
    >
      <Text className="text-white font-roboto-bold text-xl">
        {symbol}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
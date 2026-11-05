import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import * as Haptics from 'expo-haptics';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const BasicButton = ({ title, onPress, className = '', ...props }: ButtonProps) => {

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      className={`bg-primary py-4 rounded-xl items-center shadow-lg ${className}`}
      onPress={handlePress}
      {...props}
    >
      <Text className="text-black font-roboto-bold text-lg tracking-wider">
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default BasicButton
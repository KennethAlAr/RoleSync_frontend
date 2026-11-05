import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface SecondaryLinkProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
}

const SecondaryLink = ({ title, onPress, className = '', ...props }: SecondaryLinkProps) => {

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      {...props}
    >
      <Text className={`text-primary font-roboto-regular text-xs tracking-wide ${className}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default SecondaryLink;
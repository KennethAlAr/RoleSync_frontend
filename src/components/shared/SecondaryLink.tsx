import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface SecondaryLinkProps extends TouchableOpacityProps {
  title: string;
}

const SecondaryLink = ({ title, onPress, className = '', ...props }: SecondaryLinkProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      {...props}
    >
      <Text className={`text-primary font-roboto-regular text-xs tracking-wide ${className}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default SecondaryLink;
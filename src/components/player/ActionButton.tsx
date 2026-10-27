import { TouchableOpacity, Text } from 'react-native';

interface StatButtonProps {
  symbol: string;
  bgColor: string;
  onPress: () => void;
}

const StatButton = ({ symbol, bgColor, onPress }: StatButtonProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`w-10 h-10 ${bgColor} rounded-xl items-center justify-center active:opacity-70`}
    >
      <Text className="text-white font-roboto-bold text-xl">
        {symbol}
      </Text>
    </TouchableOpacity>
  );
};

export default StatButton;
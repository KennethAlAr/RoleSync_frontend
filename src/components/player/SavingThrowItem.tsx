import { View, Text, TouchableOpacity } from 'react-native'

interface SavingThrowItemProps {
    name: string;
    mod:string;
    proficient: boolean;
    onPress?: () => void;
}

const SavingThrowItem = ({name, mod, proficient, onPress}:SavingThrowItemProps) => {
  return (
   <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="w-[48%] flex-row items-center justify-between bg-background p-3 rounded-xl mb-2.5 border border-background-100">                        
        <View className="flex-row items-center gap-2">
            <View 
            className={`w-3 h-3 rounded-full border border-primary ${
                proficient 
                ? 'bg-primary' 
                : ''
            }`} 
            />
            <Text className="text-white font-roboto-bold text-sm">
            {name}
            </Text>
        </View>

        <Text className="text-primary font-roboto-bold text-sm">
            {mod}
        </Text>
    </TouchableOpacity>
  )
}

export default SavingThrowItem
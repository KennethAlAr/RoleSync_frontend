import { View, Text } from 'react-native'

import { useCharacterStore } from '@/store/characterStore';

import StatCardWrapper from '@/components/player/StatCardWrapper';
import SavingThrowItem from './SavingThrowItem';

const SavingThrowsSection = () => {

    const {savingThrows} = useCharacterStore();

    return (
        <StatCardWrapper backgroundImage={require('@/assets/images/bg-saving-throws.webp')}>
        
            <View className="p-1 relative z-10">
                
                <Text className="text-primary font-roboto-bold text-xs uppercase tracking-wider mb-3 text-center">
                Tiradas de Salvación
                </Text>

                <View className="flex-row flex-wrap justify-between">
                    {savingThrows.map((item) => (
                        <SavingThrowItem 
                            key={item.name}
                            name={item.name}
                            mod={item.mod}
                            proficient={item.proficient}
                        />
                    ))}
                </View>

            </View>

        </StatCardWrapper>
    )
}

export default SavingThrowsSection
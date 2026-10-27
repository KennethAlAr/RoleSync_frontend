import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface StatCardWrapperProps {
  backgroundImage: any;
  children: React.ReactNode;
}

const StatCardWrapper = ({ backgroundImage, children }: StatCardWrapperProps) => {
  return (
    <View className="bg-background-200 border border-tertiary rounded-2xl mb-3 shadow-sm overflow-hidden relative">
      
      <Image 
        source={backgroundImage} 
        className="absolute right-0 top-0 bottom-0 w-3/4 h-full opacity-25"
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          colors.background.secondary,
          'transparent'
        ]}
        locations={[0.3, 0.95]}   
        start={{ x: 0, y: 0 }}      
        end={{ x: 1, y: 0 }}        
        style={StyleSheet.absoluteFill}
      />

      <View className="p-4 relative z-10">
        {children}
      </View>

    </View>
  );
};

export default StatCardWrapper;
import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

interface StatInputBarProps {
  value: number;
  maxValue?: number;
  onChangeText: (val: number) => void;
  innerColor1: string;
  innerColor2: string;
}

const StatInputBar = ({ 
  value, 
  maxValue, 
  onChangeText, 
  innerColor1,
  innerColor2
}: StatInputBarProps) => {
  
	const [textValue, setTextValue] = useState(value.toString());

  useEffect(() => {
    setTextValue(value.toString());
  }, [value]);

  const percentage = maxValue ? Math.min(Math.max((value / maxValue) * 100, 0), 100) : 0;
  const hasValue = maxValue === undefined && value > 0;

	const handleTextChange = (val: string) => {
    setTextValue(val);

    if (val === '' || val === '-') {
      onChangeText(0);
    } else {
      const parsed = Number(val);
      if (!isNaN(parsed)) {
        onChangeText(parsed);
      }
    }
  };

  return (
    <View className="flex-1 bg-black/50 border border-primary h-10 rounded-xl overflow-hidden relative justify-center">
      
      {maxValue !== undefined && (
        <View 
          style={{ width: `${percentage}%` }}
          className="absolute left-0 top-0 bottom-0 overflow-hidden"
        >
          <LinearGradient
            colors={[innerColor1, innerColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
          >
            <View 
              style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} 
              className="absolute inset-0 border-t-[3px] border-l-[3px] border-white/25 pointer-events-none" 
            />
          </LinearGradient>
        </View>
      )}

      {hasValue && (
        <View className="absolute inset-0 overflow-hidden">
          <LinearGradient
            colors={[innerColor1, innerColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 10 }}
          >
            <View 
              style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }} 
              className="absolute inset-0 border-t-[3px] border-l-[3px] border-white/25 pointer-events-none" 
            />
          </LinearGradient>
        </View>
      )}

      <View className="flex-row items-center justify-center relative z-10 px-3 w-full">
        <TextInput 
          keyboardType="numeric"
          value={textValue}
          onChangeText={handleTextChange}
          selectTextOnFocus={true}
          className="text-white font-roboto-bold text-lg text-center p-0"
        />
        
        {maxValue !== undefined && (
          <Text className="text-primary font-roboto-regular text-sm ml-1">
            / {maxValue}
          </Text>
        )}
      </View>

    </View>
  );
};

export default StatInputBar;
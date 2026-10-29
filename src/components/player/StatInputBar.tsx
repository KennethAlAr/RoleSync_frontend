import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';

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
    if (parseInt(textValue || '0', 10) === value) return;
    setTextValue(value.toString());
  }, [value]);

  const percentage = maxValue ? Math.min(Math.max((value / maxValue) * 100, 0), 100) : 0;
  const isTempHpActive = maxValue === undefined && value > 0;

  const handleBlur = () => {
    if (textValue === '') {
      setTextValue('0');
      onChangeText(0);
    }
  };

  const handleTextChange = (val: string) => {
    const cleanText = val.replace(/[^0-9]/g, '');

    if (cleanText === '') {
      setTextValue('');
      onChangeText(0);
      return;
    }

    let parsed = parseInt(cleanText, 10);
    if (isNaN(parsed)) parsed = 0;

    if (maxValue !== undefined && parsed > maxValue) {
      parsed = maxValue;
    }

    setTextValue(parsed.toString());
    onChangeText(parsed);
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

      {isTempHpActive && (
        <View className="absolute inset-0 flex-row gap-1 p-1 overflow-hidden">
          {value > 20 ? (
            <View className="flex-1 h-full rounded-md overflow-hidden relative">
              <LinearGradient
                colors={[innerColor1, innerColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
              <View className="absolute inset-0 border-t-[2px] border-l-[2px] border-white/35 rounded-md pointer-events-none" />
            </View>
          ) : (
            Array.from({ length: value }).map((_, index) => (
              <View 
                key={index} 
                className="flex-1 h-full rounded-md overflow-hidden relative"
              >
                <LinearGradient
                  colors={[innerColor1, innerColor2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
                <View className="absolute inset-0 border-t-[2px] border-l-[2px] border-white/35 rounded-md pointer-events-none" />
              </View>
            ))
          )}
        </View>
      )}

      <View className="flex-row items-center justify-center relative z-10 px-3 w-full">
        <TextInput 
          keyboardType="numeric"
          value={textValue}
          placeholder="0"
          placeholderTextColor={colors.white}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
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
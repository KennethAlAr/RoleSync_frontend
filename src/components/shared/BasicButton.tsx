import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const BasicButton = ({ title, onPress, className = '', ...props }: ButtonProps) => {
  return (
    <TouchableOpacity 
      className={`bg-primary py-4 rounded-xl items-center shadow-lg ${className}`}
      onPress={onPress}
      {...props}
    >
      <Text className="text-black font-roboto-bold text-lg tracking-wider">
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default BasicButton
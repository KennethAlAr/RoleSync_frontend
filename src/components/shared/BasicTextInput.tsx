import { TextInput, TextInputProps } from 'react-native';
import { forwardRef } from 'react';


interface BasicTextInputProps extends TextInputProps {
  className?: string;
}

const BasicTextInput = forwardRef<TextInput, BasicTextInputProps>(({className= '', ...props}, ref) => {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor='#71717a'
      returnKeyType='done'
      className= {`w-full bg-background-100 border border-primary text-primary py-3.5 px-4 rounded-xl font-roboto-regular mb-4 text-center text-base ${className}`}
      {...props}
    />
  );
});

BasicTextInput.displayName = 'BasicTextInput';

export default BasicTextInput;
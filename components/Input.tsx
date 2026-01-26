import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  setValue: (text: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  icon?: React.ReactNode;
}

const Input = ({ label, value, setValue, placeholder, type, icon }: InputProps) => {
  return (
    <View className="w-full mb-4">
      <Text className="text-gray-700 text-lg font-medium mb-2">{label}</Text>
      <View className="relative w-full">
        <View className="absolute left-4 top-[22] ">
          <FontAwesome6 name={icon as any} size={15} color="gray" />
        </View>
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text)}
          placeholder={placeholder}
          placeholderTextColor='gray'
          secureTextEntry={type === 'password'}
          className={`text-lg border border-gray-300 px-4 py-4 pb-5 mb-2 pl-12 rounded-xl `}
        />  
      </View>
    </View>
  )
}

export default Input
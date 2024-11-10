import { View, Text, KeyboardTypeOptions, TextInput, TouchableOpacity, Image} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: KeyboardTypeOptions;
}

const FormField: React.FC<FormFieldProps> = ({ title, value, placeholder, handleChangeText, otherStyles, keyboardType }) => {

  const[showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-medium'>{title}</Text>
      <View
        className='border-2 border-black-200 w-full h-16 px-4  bg-black-100 rounded-2xl focus:border-blue-600 items-center flex-row'
      >
        <TextInput 
          className='flex-1 text-white font-semibold text-base'
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Contraseña" && !showPassword}
          
        />
          {title === "Contraseña" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name='eye' size={24} color="gray" />
            </TouchableOpacity>
          )}
      </View>
    </View>
  )
}

export default FormField
import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/AuthContext';

const EmployeesPage = () => {

  const { token, signOut } = useAuth();

  return (
    <View>
      <Text>Token: {token}</Text>
      <Text>EmployeesPage</Text>
    </View>
  )
}

export default EmployeesPage
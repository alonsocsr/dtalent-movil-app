import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [toggle, setToggle] = useState<boolean>(false);
 
  const {user, signOut } = useAuth();

  const toggleLogout  = () => {
    setToggle(!toggle);
  };

  return (
    <View className='flex flex-1 h-full'>
      <DrawerContentScrollView {...props} 
        scrollEnabled={false}
        contentContainerStyle={{ backgroundColor: '#000000', height: '100%'}}
      >
        <View className='p-5'>
          <Image
            source={require('../assets/images/dTalentLogo.png')}
            style={{
              width: '100%',
              height: undefined,
              aspectRatio: 732 / 180,
            }}
          />
        </View>
        <DrawerItemList {...props} />
        
      </DrawerContentScrollView>
      
       {/* Footer with User Info */}
       <View className='bg-black flex-col p-4 border-t border-gray-700'>
        {user && (
          <View className='flex-row items-center'>
            {/* User Avatar */}
            <View
              style={{
                backgroundColor: '#4285F4',
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Text className='text-white font-bold'>
                {user.fullName
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>

            {/* User Name and Welcome Message */}
            <View className='flex-1'>
              <Text className='text-white font-semibold text-lg'>Bienvenido</Text>
              <Text className='text-white'>{user.fullName}</Text>
            </View>

            {/* Options Icon */}
            <TouchableOpacity onPress={toggleLogout}>
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        {toggle && (
          <DrawerItem
            label="Cerrar Sesión"
            onPress={signOut}
            labelStyle={{ color: '#fff' }}
            style={{ marginTop: 10 }}
          />
        )}
      </View>
    </View>
  );
};

export default CustomDrawerContent
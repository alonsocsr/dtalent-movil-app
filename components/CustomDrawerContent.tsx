import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const {user, signOut } = useAuth();

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
      <View
        className='bg-black flex-col'
      >
        {user && (
        <View >
          <Text className='text-white'>{user.fullName}</Text>
          <Text className='text-white' >{user.email}</Text>
          <DrawerItem 
            label="Cerrar Sesión" 
            onPress={signOut} 
            labelStyle={{ color: "#fff" }}
          />
        </View>
      )}
      </View>
    </View>
  )
}

export default CustomDrawerContent
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

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
        
      >
        <DrawerItem label={'Logout'} onPress={() => router.replace('/')} />
      </View>
    </View>
  )
}

export default CustomDrawerContent
import 'react-native-gesture-handler';

import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { AuthProvider } from '@/context/AuthContext';

const TabsLayout = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView className='flex flex-1 h-full'>
        <Drawer 
          drawerContent={CustomDrawerContent}
          screenOptions={{
            drawerHideStatusBarOnOpen: true,
            drawerActiveBackgroundColor: "#0087D1",
            drawerActiveTintColor: "#fff",
            drawerInactiveTintColor: "#fff",
            drawerLabelStyle: { marginLeft: -20}
          }}
        >
          <Drawer.Screen 
            name='employees' 
            options={{ 
              drawerLabel: "Empleados",
              headerTitle: '',
              drawerIcon: ({ size, color }) => (
                <Ionicons name='people-sharp' size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen 
            name='receipts' 
            options={{ 
              drawerLabel: "Recibos",
              headerTitle: '',
              drawerIcon: ({ size, color }) => (
                <Ionicons name='receipt-sharp' size={size} color={color} />
              ),
            }} 
          />
        </Drawer>
      </GestureHandlerRootView>
    </AuthProvider>
  )
}

export default TabsLayout
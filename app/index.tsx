import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView
        contentContainerStyle={{ height: '100%'}}
      >
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={require('../assets/images/dTalentLogo.png')}
            style={{
              width: '100%',
              height: undefined,
              aspectRatio: 732 / 180,
            }}
          />
          <View
            className="relative mt-5"
          >
            <Text className="text-2xl text-white font-bold text-center">La{' '}
              <Text className="text-blue-600">solución integral</Text>{' '}que permite acceder a los recibos de sueldo de manera digital
            </Text>
            <View className="justify-center items-center">
              <CustomButton 
                title="Iniciar Sesión"
                handlePress={() => router.push('/sign-in')}
                containerStyles="w-full mt-7"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

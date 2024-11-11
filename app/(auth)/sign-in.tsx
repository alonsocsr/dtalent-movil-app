import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const { signIn, isLoading } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    try {
      await signIn(form.username, form.password);
      Alert.alert('Success', 'You are signed in!');
      router.replace("/employees");
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    }
  };

  return (
    <SafeAreaView className="bg-gray-900 h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={require('../../assets/images/dTalentLogo.png')}
            style={{
              width: '100%',
              height: undefined,
              aspectRatio: 732 / 180,
            }}
            className="mb-10"
          />

          <FormField
            title="Nombre de Usuario"
            value={form.username}
            placeholder="Ingresa tu nombre de usuario"
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Contraseña"
            value={form.password}
            placeholder="Ingresa tu contraseña"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Iniciar Sesión"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isLoading}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              ¿No tienes una cuenta?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-blue-600"
            >
              Registrate
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
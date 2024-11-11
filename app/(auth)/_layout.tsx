import { AuthProvider } from "@/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const AuthLayout = () => {


  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </AuthProvider>
  );
};

export default AuthLayout;
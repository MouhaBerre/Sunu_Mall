import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./src/lib/auth";
import type { DriverStackParamList } from "./src/navigation/types";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import DeliveriesListScreen from "./src/screens/driver/DeliveriesListScreen";
import ActiveDeliveryScreen from "./src/screens/driver/ActiveDeliveryScreen";

const Stack = createNativeStackNavigator();
const DriverStack = createNativeStackNavigator<DriverStackParamList>();

function RootNavigator() {
  const { isReady, isAuthenticated, isDriver } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
      </Stack.Navigator>
    );
  }

  if (isDriver) {
    return (
      <DriverStack.Navigator>
        <DriverStack.Screen name="Deliveries" component={DeliveriesListScreen} options={{ title: "Mes livraisons" }} />
        <DriverStack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} options={{ title: "Livraison en cours" }} />
      </DriverStack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "SUNU MALL" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../lib/api";
import type { DriverStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<DriverStackParamList, "ActiveDelivery">;

export default function ActiveDeliveryScreen({ route }: Props) {
  const { deliveryId } = route.params;
  const [sharing, setSharing] = useState(false);
  const [code, setCode] = useState("");
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    return () => {
      subscriptionRef.current?.remove();
    };
  }, []);

  async function startSharing() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "La localisation est nécessaire pour partager votre position.");
      return;
    }
    subscriptionRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 20 },
      (position) => {
        api
          .post(`/orders/deliveries/${deliveryId}/location/`, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          .catch(() => {});
      }
    );
    setSharing(true);
  }

  function stopSharing() {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setSharing(false);
  }

  async function markPickedUp() {
    await api.post(`/orders/deliveries/${deliveryId}/status/`, { status: "picked_up" });
    Alert.alert("Colis récupéré", "Un code de confirmation a été envoyé au client.");
  }

  async function confirmDelivery() {
    try {
      await api.post(`/orders/deliveries/${deliveryId}/confirm/`, { code });
      Alert.alert("Livraison confirmée", "La commande est marquée comme livrée.");
      stopSharing();
    } catch {
      Alert.alert("Code invalide", "Vérifiez le code auprès du client.");
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title={sharing ? "Arrêter le partage de position" : "Démarrer le partage de position"}
        onPress={sharing ? stopSharing : startSharing}
      />
      <View style={styles.spacer} />
      <Button title="Colis récupéré (pris en charge)" onPress={markPickedUp} />

      <Text style={styles.label}>Code de confirmation du client :</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />
      <Button title="Confirmer la livraison" onPress={confirmDelivery} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  spacer: { height: 12 },
  label: { marginTop: 24, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12 },
});

import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { api } from "../../lib/api";
import type { DriverStackParamList } from "../../navigation/types";

interface Delivery {
  id: string;
  order: string;
  status: string;
}

type Props = NativeStackScreenProps<DriverStackParamList, "Deliveries">;

export default function DeliveriesListScreen({ navigation }: Props) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Delivery[]>("/orders/deliveries/mine/");
      setDeliveries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function accept(id: string) {
    await api.post(`/orders/deliveries/${id}/accept/`);
    navigation.navigate("ActiveDelivery", { deliveryId: id });
  }

  async function decline(id: string) {
    await api.post(`/orders/deliveries/${id}/decline/`);
    load();
  }

  return (
    <FlatList
      data={deliveries}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={load}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>Aucune livraison assignée.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.status}>Statut : {item.status}</Text>
          <View style={styles.actions}>
            <Button title="Accepter" onPress={() => accept(item.id)} />
            <Button title="Refuser" color="#c0392b" onPress={() => decline(item.id)} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, flexGrow: 1 },
  empty: { textAlign: "center", color: "#555", marginTop: 32 },
  card: { borderWidth: 1, borderColor: "#e2e2e2", borderRadius: 8, padding: 12, marginBottom: 12 },
  status: { fontWeight: "600", marginBottom: 8 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
});

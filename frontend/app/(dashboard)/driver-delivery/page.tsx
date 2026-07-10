"use client";

import DriverDeliveryScreen from "@/components/screens/DriverDeliveryScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["livreur"]}>
      <DriverDeliveryScreen />
    </RoleGuard>
  );
}

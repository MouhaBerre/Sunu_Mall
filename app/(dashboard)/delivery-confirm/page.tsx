"use client";

import DeliveryConfirmScreen from "@/components/screens/DeliveryConfirmScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["livreur"]}>
      <DeliveryConfirmScreen />
    </RoleGuard>
  );
}

"use client";

import MerchantScreen from "@/components/screens/MerchantScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["vendeur"]}>
      <MerchantScreen />
    </RoleGuard>
  );
}

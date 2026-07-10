"use client";

import DriverDashboardScreen from "@/components/screens/DriverDashboardScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["livreur"]}>
      <DriverDashboardScreen />
    </RoleGuard>
  );
}

"use client";

import AnalyticsScreen from "@/components/screens/AnalyticsScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["vendeur"]}>
      <AnalyticsScreen />
    </RoleGuard>
  );
}

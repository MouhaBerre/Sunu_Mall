"use client";

import AdminManagersScreen from "@/components/screens/AdminManagersScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminManagersScreen />
    </RoleGuard>
  );
}

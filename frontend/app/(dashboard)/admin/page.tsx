"use client";

import AdminScreen from "@/components/screens/AdminScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminScreen />
    </RoleGuard>
  );
}

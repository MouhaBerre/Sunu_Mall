"use client";

import AdminShopsScreen from "@/components/screens/AdminShopsScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["admin"]}>
      <AdminShopsScreen />
    </RoleGuard>
  );
}

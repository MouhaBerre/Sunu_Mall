"use client";

import AddProductScreen from "@/components/screens/AddProductScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["vendeur"]}>
      <AddProductScreen />
    </RoleGuard>
  );
}

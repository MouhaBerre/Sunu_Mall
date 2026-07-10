"use client";

import CatalogScreen from "@/components/screens/CatalogScreen";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <RoleGuard roles={["vendeur"]}>
      <CatalogScreen />
    </RoleGuard>
  );
}

import { Suspense } from "react";
import LoginScreen from "@/components/screens/LoginScreen";

export default function Page() {
  return (
    <Suspense>
      <LoginScreen />
    </Suspense>
  );
}

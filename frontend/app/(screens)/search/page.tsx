import { Suspense } from "react";
import SearchScreen from "@/components/screens/SearchScreen";

export default function Page() {
  return (
    <Suspense>
      <SearchScreen />
    </Suspense>
  );
}

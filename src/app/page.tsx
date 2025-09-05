import { Suspense } from "react";
import { RegexTester } from "@/components/regex-tester";

export default function Page() {
  return (
    <Suspense>
      <RegexTester />
    </Suspense>
  );
}

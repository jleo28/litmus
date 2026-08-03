import { Suspense } from "react";
import SigninScreen from "@/components/signin/SigninScreen";

export default function SigninPage() {
  return (
    <Suspense>
      <SigninScreen />
    </Suspense>
  );
}

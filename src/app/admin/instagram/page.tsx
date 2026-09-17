import { Suspense } from "react";
import InstagramGenerator from "./InstagramGenerator";

export default function InstagramGeneratorPage() {
  return (
    <Suspense fallback={null}>
      <InstagramGenerator />
    </Suspense>
  );
}

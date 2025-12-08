"use client";

import { Suspense } from "react";
import Loading from "@/components/Loading";
import SearchContent from "@/components/SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading message="Loading search..." fullScreen />}>
      <SearchContent />
    </Suspense>
  );
}

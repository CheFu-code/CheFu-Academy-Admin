"use client";

import { Suspense } from "react";
import Loading from "@/components/Shared/Loading";
import SearchContent from "@/components/SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading message="Loading search..." />}>
      <SearchContent />
    </Suspense>
  );
}

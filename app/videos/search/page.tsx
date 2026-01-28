"use client";

import SearchContent from "@/components/SearchContent";
import VideoCardSkeleton from "@/components/skeletons/VideoCardSkeleton";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<VideoCardSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

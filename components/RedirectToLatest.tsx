"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectToLatestProps {
  slug: string;
}

export function RedirectToLatest({ slug }: RedirectToLatestProps) {
  const router = useRouter();

  useEffect(() => {
    // Determine the full URL based on the current context (handled by the router)
    // We simply push the slug to the end of the current path if needed,
    // but here we expect the full relative path to be passed or constructed.
    // However, to keep it simple and robust, we will replace the URL.
    if (slug) {
      router.replace(slug);
    }
  }, [slug, router]);

  // Render a loading state while we redirect
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-pulse">
      <p>Loading latest article...</p>
    </div>
  );
}

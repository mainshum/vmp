"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="center-absolute">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong!
      </h1>
      <h2>{JSON.stringify(error, null, 2)}</h2>
    </div>
  );
}

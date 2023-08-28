"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="center-absolute">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong!
      </h1>
    </div>
  );
}

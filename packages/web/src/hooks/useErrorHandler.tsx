"use client";

import { useCallback, useState } from "react";

interface ErrorState {
  hasError: boolean;
  error?: Error;
}

interface ErrorHandler {
  hasError: boolean;
  error?: Error;
  resetError: () => void;
  handleError: (error: Error) => void;
}

export default function useErrorHandler(): ErrorHandler {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: undefined,
  });

  const handleError = useCallback((error: Error) => {
    console.error("Component error:", error);
    setErrorState({
      hasError: true,
      error,
    });

    // Maybe report this somewhere in the future
    // e.g., Sentry.captureException(error);
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: undefined,
    });
  }, []);

  return {
    hasError: errorState.hasError,
    error: errorState.error,
    resetError,
    handleError,
  };
}

// NOTE: This is not the Appwrite integration file. Appwrite glue code should go in a new file, e.g., 'appwrite.ts'.
import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  });
}

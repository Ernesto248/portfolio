import { useEffect, useState } from "react";

/** Demo data is isolated to this browser tab and never sent to an API. */
export function useDemoSession<T>(key: string, initial: () => T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(`leonard-demo-v2:${key}`);
      return saved ? JSON.parse(saved) as T : initial();
    } catch {
      return initial();
    }
  });

  useEffect(() => {
    try { sessionStorage.setItem(`leonard-demo-v2:${key}`, JSON.stringify(value)); }
    catch { /* The demo remains usable when storage is unavailable. */ }
  }, [key, value]);

  return [value, setValue];
}

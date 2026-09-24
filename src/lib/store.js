import { useCallback, useEffect, useState } from "react";
import { getStorage, setStorage } from "./storage";
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
/** Reactive LocalStorage collection hook. Replaceable with API calls later. */
export function useCollection(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);
  const read = useCallback(() => {
    setValue(getStorage(key, fallback));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    read();
    listeners.add(read);
    window.addEventListener("storage", read);
    return () => {
      listeners.delete(read);
      window.removeEventListener("storage", read);
    };
  }, [read]);
  const write = useCallback(
    (next) => {
      setStorage(key, next);
      emit();
    },
    [key],
  );
  return { data: value, setData: write, ready };
}
export function notifyStoreChange() {
  emit();
}

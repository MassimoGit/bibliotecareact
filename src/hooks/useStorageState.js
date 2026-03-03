import { useState, useEffect } from "react";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return initialState;

    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useStorageState;

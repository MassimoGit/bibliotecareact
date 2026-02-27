import { useState, useEffect } from "react";

const useStorageState = (key, initialState, options = {}) => {
  const { expiresIn } = options;

  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return initialState;

    try {
      const parsed = JSON.parse(stored);

      // Se il dato ha un timestamp (formato con scadenza)
      if (expiresIn && parsed && typeof parsed === "object" && "value" in parsed && "timestamp" in parsed) {
        const isExpired = Date.now() - parsed.timestamp > expiresIn;
        if (isExpired) {
          localStorage.removeItem(key);
          return initialState;
        }
        return parsed.value;
      }

      return parsed;
    } catch {
      return stored;
    }
  });

  useEffect(() => {
    if (expiresIn) {
      localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, expiresIn]);

  return [value, setValue];
};

export default useStorageState;

// src/hooks/useLocalStorage.ts
export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const getItem = <T = unknown>(): T | null => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  // 문자열 토큰을 그냥 저장/가져오고 싶을 때용
  const setRaw = (value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  };
  const getRaw = () => window.localStorage.getItem(key);

  return { setItem, getItem, removeItem, setRaw, getRaw };
};

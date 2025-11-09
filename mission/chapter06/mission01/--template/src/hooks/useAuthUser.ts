// src/hooks/useAuthUser.ts
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constans/key";
import type { ResponseMyInfoDto } from "../types/auth";

export function useAuthUser() {
  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    getMyInfo()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    setUser(null);
  };

  return { user, loading, logout };
}

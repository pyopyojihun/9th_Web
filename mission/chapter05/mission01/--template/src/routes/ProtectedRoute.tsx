// src/routes/ProtectedRoute.tsx
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import PremiumGate from "../components/PremiumGate";

type ProtectedRouteProps = {
  children: ReactNode;
  requirePremium?: boolean;
};

export default function ProtectedRoute({ children, requirePremium }: ProtectedRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<null | { isPremium?: boolean }>(null);

  // 1) 토큰 없으면 로그인으로
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) 토큰 있으면 /v1/users/me 조회
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMyInfo();
        // 백엔드 응답 스펙에 맞게 조정하세요.
        // 예: res.data = { id, name, email, isPremium: boolean }
        if (mounted) setMe(res?.data ?? null);
      } catch {
        if (mounted) setMe(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null; // 스켈레톤/스피너 넣고 싶으면 여기에

  // 3) requirePremium이면, 페이지는 보여주되 오버레이를 깔아 잠금 처리
  if (requirePremium && !me?.isPremium) {
    return <PremiumGate>{children}</PremiumGate>;
  }

  // 4) 그 외에는 그대로 렌더
  return <>{children}</>;
}


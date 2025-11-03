import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getMyInfo } from "../apis/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requirePremium?: boolean;
};

export default function ProtectedRoute({
  children,
  requirePremium,
}: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMyInfo();
        if (!mounted) return;
        setIsAuthed(true);
        setIsPremium(!!me.data?.isPremium);
      } catch {
        if (!mounted) return;
        setIsAuthed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) return null;

  // 로그인 안 되어 있으면 로그인 페이지로
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 프리미엄 요구인데 프리미엄이 아니면: 페이지는 보여주되, 잠금 오버레이를 children 쪽에서 처리하도록
  if (requirePremium && !isPremium) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

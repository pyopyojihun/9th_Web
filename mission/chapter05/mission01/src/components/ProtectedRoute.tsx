import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // localStorage에서 사용자 정보 확인
  const userStr = localStorage.getItem('user');
  
  // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // 토큰이 있는지 확인 (실제 API 연동 시에는 토큰 유효성 검증 필요)
    if (!user.email) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('사용자 정보 파싱 오류:', error);
    return <Navigate to="/login" replace />;
  }

  // 인증된 사용자는 요청한 페이지를 렌더링
  return <>{children}</>;
}
// src/pages/GoogleCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../apis/auth';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        // URL에서 authorization code 가져오기
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('Authorization code가 없습니다.');
        }

        console.log('🔄 Google OAuth 콜백 처리 중...');
        console.log('Authorization code:', code);

        // 백엔드 API 호출하여 토큰 교환
        const response = await handleGoogleCallback(code);

        console.log('✅ Google 로그인 성공:', response);

        // 사용자 정보와 토큰 저장
        localStorage.setItem('user', JSON.stringify({
          email: response.data.email || '',
          name: response.data.name,
          id: response.data.id,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }));

        alert('Google 로그인 성공!');
        navigate('/', { replace: true });
      } catch (err: any) {
        console.error('❌ Google 로그인 실패:', err);
        setError(err.response?.data?.message || err.message || 'Google 로그인에 실패했습니다.');
      }
    };

    processGoogleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-red-500 mb-2">로그인 실패</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
        <p className="text-gray-400 text-lg">Google 로그인 처리 중...</p>
        <p className="text-gray-600 text-sm mt-2">잠시만 기다려주세요</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
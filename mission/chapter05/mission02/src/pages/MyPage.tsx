// src/pages/MyPage.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyInfo } from '../api/auth';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

const ProtectedPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('📡 사용자 정보 조회 중...');
        const response = await getMyInfo();
        console.log('✅ 사용자 정보:', response);
        setUserInfo(response.data);
      } catch (err: any) {
        console.error('❌ 사용자 정보 조회 실패:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('user');
    alert('로그아웃되었습니다.');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-fuchsia-500">🔒 보호된 페이지</h1>
        
        <div className="bg-gray-800 p-4 rounded-md">
          <p className="text-gray-400 text-sm mb-3">로그인된 사용자 정보</p>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400 text-sm">ID:</span>
              <p className="text-white">{userInfo?.id}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">이름:</span>
              <p className="text-white">{userInfo?.name}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">이메일:</span>
              <p className="text-white">{userInfo?.email}</p>
            </div>
            {userInfo?.bio && (
              <div>
                <span className="text-gray-400 text-sm">소개:</span>
                <p className="text-white">{userInfo.bio}</p>
              </div>
            )}
            <div>
              <span className="text-gray-400 text-sm">가입일:</span>
              <p className="text-white">{new Date(userInfo?.createdAt || '').toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 bg-gray-800 p-4 rounded-md">
          <p className="mb-2">✅ 이 페이지는 로그인한 사용자만 접근할 수 있습니다.</p>
          <p className="mb-2">✅ 로그인하지 않은 사용자는 자동으로 로그인 페이지로 리다이렉트됩니다.</p>
          <p className="text-fuchsia-400 font-medium">✅ 액세스 토큰이 만료되면 자동으로 재발급됩니다!</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            홈으로
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedPage;
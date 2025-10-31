import { useNavigate } from 'react-router-dom';

const ProtectedPage = () => {
  const navigate = useNavigate();
  
  // localStorage에서 사용자 정보 가져오기
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('user');
    alert('로그아웃되었습니다.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-fuchsia-500">🔒 보호된 페이지</h1>
        
        <div className="bg-gray-800 p-4 rounded-md">
          <p className="text-gray-400 text-sm mb-2">로그인된 사용자 정보</p>
          <div className="space-y-2">
            <p className="text-white">
              <span className="text-gray-400">이메일:</span> {user?.email}
            </p>
            <p className="text-white">
              <span className="text-gray-400">닉네임:</span> {user?.nickname || '미설정'}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-400 bg-gray-800 p-4 rounded-md">
          <p className="mb-2">✅ 이 페이지는 로그인한 사용자만 접근할 수 있습니다.</p>
          <p>✅ 로그인하지 않은 사용자는 자동으로 로그인 페이지로 리다이렉트됩니다.</p>
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
// src/components/PremiumGate.tsx
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PremiumGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goPremium = () => {
    // 결제/상품 안내 페이지로 보낼 경로로 바꿔주세요.
    navigate("/premium/subscribe", { state: { from: location } });
  };

  return (
    <div className="relative">
      {/* 원본 컨텐츠는 흐림/비활성화 */}
      <div className="pointer-events-none blur-sm select-none">{children}</div>

      {/* 상단 띠 배너 */}
      <div className="fixed top-0 inset-x-0 z-40 bg-amber-500 text-black text-center py-2 text-sm font-medium">
        프리미엄이 필요한 콘텐츠입니다. 지금 업그레이드하고 전체 보기!
      </div>

      {/* 중앙 오버레이 카드 */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-md mx-4 rounded-xl border border-neutral-700 bg-black/80 backdrop-blur p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">프리미엄 전용</h3>
          <p className="text-sm text-neutral-300 mb-4">
            현재 계정은 프리미엄 권한이 없습니다. 결제 후 전체 내용을 볼 수 있어요.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 border border-neutral-600 hover:bg-neutral-800 rounded-md py-2"
            >
              뒤로가기
            </button>
            <button
              onClick={goPremium}
              className="flex-1 bg-pink-600 hover:bg-pink-500 rounded-md py-2"
            >
              프리미엄 결제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

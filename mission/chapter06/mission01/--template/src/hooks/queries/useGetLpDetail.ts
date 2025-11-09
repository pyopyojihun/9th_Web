import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

// lpId로 상세를 가져오는 전용 훅
export default function useGetLpDetail(lpId?: string | number) {
  return useQuery({
    queryKey: ["lp", lpId],            // 상세는 ['lp', lpId]로 구분
    enabled: !!lpId,                   // lpId 없으면 요청 안 함
    queryFn: () => getLpDetail(Number(lpId)),
    staleTime: 5 * 60 * 1000,          // 5분
    gcTime: 10 * 60 * 1000,            // 10분
  });
}


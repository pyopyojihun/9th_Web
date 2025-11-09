import {
  useQuery,
  type NoInfer,
  type UseQueryResult,
} from "@tanstack/react-query";

export const useCustomFetch = <T>(
  url: string
): UseQueryResult<NoInfer<T>, Error> => {
  return useQuery<NoInfer<T>, Error>({
    queryKey: [url],
    queryFn: async ({signal}) => {
      const response = await fetch(url,{signal});
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json() as Promise<T>;
    },
    staleTime: 5 * 60 * 1000, //5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), //30초

    //쿼리가 사용되지 않은채로 10분이 지나면 캐시에서 제거
    gcTime: 10 * 60 * 1000, //10 minutes
  });
};

// import { useEffect, useMemo, useRef, useState } from "react";

// const STALE_TIME = 5 * 60 * 1000; // 5 minutes
// const MAX_RETRIES = 3;
// const INITIAL_RETRY_DELAY = 1000; // 1 second

// interface CacheEntry<T> {
//   data: T;
//   lastFetched: number;
// }

// export const useCustomFetch = <T>(
//   url: string
// ): { data: T | null; isPending: boolean; isError: boolean } => {
//   const [data, setData] = useState<T | null>(null);
//   const [isPending, setIsPending] = useState<boolean>(false);
//   const [isError, setIsError] = useState<boolean>(false);

//   const storageKey = useMemo((): string => `cache-${url}`, [url]);

//   const abortControllerRef = useRef<AbortController | null>(null);
//   const retryTimeoutRef = useRef<number | null>(null);

//   useEffect(() => {
//     abortControllerRef.current = new AbortController();
//     setIsError(false);

//     const fetchData = async (currentRetry = 0): Promise<void> => {
//       const currentTime = Date.now();
//       const cachedItem = localStorage.getItem(storageKey);

//       if (cachedItem) {
//         try {
//           const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

//           // fresh 캐시면 그대로 사용하고 fetch 생략
//           if (currentTime - cachedData.lastFetched < STALE_TIME) {
//             setData(cachedData.data);
//             setIsPending(false);
//             console.log("신선한 캐시 데이터 사용", url);
//             return;
//           }
//           // stale이면 오래된 데이터라도 일단 보여주고 아래에서 fetch
//           setData(cachedData.data);
//         } catch {
//           localStorage.removeItem(storageKey);
//           console.warn("캐시 에러: 캐시 삭제", url);
//         }
//       }

//       setIsPending(true);
//       try {
//         const response = await fetch(url, {
//           signal: abortControllerRef.current?.signal,
//         });
//         if (!response.ok) throw new Error("Failed to fetch data");
//         const json = (await response.json()) as T;
//         setData(json);

//         const newCacheEntry: CacheEntry<T> = {
//           data: json,
//           lastFetched: Date.now(),
//         };
//         localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
//       } catch (error) {
//         if (error instanceof Error && error.name === "AbortError") {
//           console.log("요청취소됨", url);
//           return;
//         }
//         if (currentRetry < MAX_RETRIES) {
//           const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
//           console.log(
//             `재시도, ${currentRetry + 1}/${MAX_RETRIES} RETRYING ${retryDelay}ms later`,
//             url
//           );

//           retryTimeoutRef.current = window.setTimeout(() => {
//             fetchData(currentRetry + 1);
//           }, retryDelay);
//         } else {
//           setIsError(true);
//           setIsPending(false);
//           console.log("모든 재시도 실패", url);
//           return;
//         }
//         setIsError(true);
//         console.error(error);
//       } finally {
//         setIsPending(false);
//       }
//     };

//     fetchData();

//     return () => {
//       abortControllerRef.current?.abort();

//       if (retryTimeoutRef.current !== null) {
//         clearTimeout(retryTimeoutRef.current);
//         retryTimeoutRef.current = null;
//       }
//     };
//   }, [url, storageKey]);

//   return { data, isPending, isError };
// };

type Props = { message?: string; onRetry?: () => void };

export default function ErrorState({ message = "문제가 발생했습니다.", onRetry }: Props) {
  return (
    <div className="w-full rounded-md border border-red-500/30 bg-red-500/5 p-4 text-red-300">
      <div className="text-sm">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded bg-red-500/20 px-3 py-1.5 text-xs hover:bg-red-500/30"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

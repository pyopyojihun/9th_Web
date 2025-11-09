import { useNavigate } from "react-router-dom";

type FabProps = { to?: string; onClick?: () => void; label?: string };
export default function Fab({ to = "/create", onClick, label = "추가" }: FabProps) {
  const nav = useNavigate();
  const handle = () => (onClick ? onClick() : nav(to));
  return (
    <button
      onClick={handle}
      aria-label={label}
      className="fixed right-5 bottom-5 md:right-8 md:bottom-8 z-[60]
                 h-12 w-12 rounded-full bg-pink-500 hover:bg-pink-600
                 text-white text-2xl leading-none shadow-lg
                 focus:outline-none focus:ring-2 focus:ring-pink-300"
    >
      +
    </button>
  );
}

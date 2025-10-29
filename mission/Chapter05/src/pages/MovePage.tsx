import { useNavigate } from "react-router-dom";

export default function MovePage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button
        onClick={goBack}
        className="text-white font-bold text-xl bg-sky-300 px-2 rounded cursor-pointer
        hover:bg-sky-500 transition-colors duration-300"
      >
        {"<"}
      </button>
    </div>
  );
}

// src/pages/PremiumWebtoonPage.tsx
import { useParams } from "react-router-dom";

export default function PremiumWebtoonPage() {
  const { id } = useParams();
  return <div>프리미엄 웹툰 페이지 (id: {id})</div>;
}

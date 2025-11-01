
import {useParams} from "react-router-dom";
export default function PremiumWebtoon(){
    const{id}=useParams();
    return(
        <div style={{padding:'20px'}}>
            <h1>프리미엄 웹툰 {id}번 페이지</h1>
            <p>여기는 프리미엄 웹툰 컨텐츠가 있는 페이지입니다.</p>
        </div>

    )}
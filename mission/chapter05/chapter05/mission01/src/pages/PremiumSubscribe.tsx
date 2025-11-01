import {useAuth} from '../auth/AuthContext';

export default function PremiumSubscribe(){
    const {user,login} = useAuth();

    const upgrade=()=>{
        if(!user) return;
        const upgraded={...user,premium:true};
        const token = localStorage.getItem('access_token')  || 'mock-token';
        login(token,upgraded);
        alert('축하합니다! 프리미엄 회원으로 업그레이드 되었습니다.');
    };
    return(
        <div style={{padding:'20px'}}>
            <h1>프리미엄 구독 페이지</h1>
            <p>프리미엄 회원이 되시면 모든 프리미엄 웹툰을 무제한으로 감상하실 수 있습니다!</p>
            <button onClick={upgrade}>프리미엄 회원으로 업그레이드</button>
        </div>
    )
    }
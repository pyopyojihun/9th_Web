import {useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/AuthContext';

export default function LoginPage(){
    const {login} =useAuth();
    const navigate=useNavigate();
    const location =useLocation() as any;
    const from =location.state?.from?.pathname || '/';

    const signInasbasic=()=>{
        const token='mock-token';
        const user={id:'u1',name:'지훈',premium:false};
        login(token,user);
        navigate(from,{replace:true});
    };

    const signInaspremium=()=>{
        const token='mock-token';
        const user={id:'u2',name:'나림',premium: true};
        login(token,user);
        navigate(from,{replace:true});
    };
    return (
        <div style={{padding:'20px'}}>
            <h1>로그인 페이지</h1>
            <button onClick={signInasbasic} style={{marginRight:'10px'}}>일반 사용자 로그인</button>
            <button onClick={signInaspremium}>프리미엄 사용자 로그인</button>
        </div>
    )
}
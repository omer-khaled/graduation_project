import React, {  useContext } from 'react'
import { context } from '../LandingPage';
import Login from './Login';
import SignupWorker from './SignupWorker';
function Signup() {
    let {state,setState} = useContext(context);
    return (
        <div className='land container'>
            {
                (state==='worker')?
                    <SignupWorker type={true}/>
                    :(state==='customer')?<SignupWorker type={false}/>:(state==='log')?<Login />:<div className='signup'>
                        <button id="worker" className='btn btn-custom' onClick={()=>{
                            setState('worker');
                        }}>
                            سجل كعامل
                        </button>
                        <button className='btn btn-custom' onClick={()=>{
                            setState('customer');
                        }}>
                            سجل كعميل
                        </button>
                        <button id="login" className='btn btn-custom mt-2' onClick={()=>{
                            setState('log');
                        }}>
                            تسجيل دخول
                        </button>
                    </div>
            }
        </div>
    )
}
export default Signup;

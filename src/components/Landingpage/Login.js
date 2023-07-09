import React, { useContext , useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { context } from '../LandingPage';
import Customer from '../../logic/customer';
import Worker from '../../logic/worker';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
function Login() {
    let {setState} = useContext(context);
    let navigator = useNavigate();
    let [data,setData] = useState(undefined);
    let [type,setType] = useState('w');
    let [massage,setMassage] = useState(undefined);
    let [openforget,setopenForget] = useState(false);
    let [forgetdata,setForgetData] = useState(undefined);
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            "password",
            'email',
        ]
        let feildsarabic = [
            "الرقم السرى",
            'البريد الالكترونى',
        ]
        const regexEmail = /^.{1,}@gmail.com$/;
        feilds.forEach((el,index)=>{
            if(data[el]===undefined||data[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }else if(el==='password'&&(data[el]).length<8){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ 8 حروف`;
                returnvalue = false;
            }
            else if(el==='email'&&!regexEmail.test((data[el]))){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح ...@gmail.com`;
                returnvalue = false;
            }
            else{
                validating[el] = undefined;
            }
        });
        setMassage({...validating});
        return returnvalue;
    }
    const validationHandleForget = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            'email',
        ]
        let feildsarabic = [
            'البريد الالكترونى',
        ]
        const regexEmail = /^.{1,}@gmail.com$/;
        feilds.forEach((el,index)=>{
            if(forgetdata[el]===undefined||forgetdata[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }
            else if(el==='email'&&!regexEmail.test((forgetdata[el]))){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح ...@gmail.com`;
                returnvalue = false;
            }
            else{
                validating[el] = undefined;
            }
        });
        setMassage({...validating});
        return returnvalue;
    }
    const handelSubmit = async()=>{
        let validate = false;
        if(data!==undefined){
            validate = validationHandle();
        }
        if(validate&&data!==undefined){
            let call_api = (type==='w')?new Worker():new Customer();
            let link_api = (type==='w')?"http://127.0.0.1:8000/api/auth-worker/login":"http://127.0.0.1:8000/api/auth-customer/login";
            console.log(data);
            let returnedData = await call_api.Postdata(link_api,{...data});
            setMassage({...returnedData});
            if(returnedData.remember_token!==undefined){
                sessionStorage.setItem('token',returnedData.remember_token);
                sessionStorage.setItem('currentid',returnedData.id);
                const MySwal = withReactContent(Swal);
                MySwal.fire({
                    title: <strong>{returnedData.message}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'success',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                }).then(function() {
                    if(type==='w'){
                        // navigator(`/Worker/${returnedData.id}`);
                        navigator(`/contractWork`);
                    }else{
                        navigator('/home');
                    }
                });
            }else{
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>{(returnedData.error!==undefined)?returnedData.error:returnedData.msg}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'error',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                })
            }   
        }
    }
    const handelforgetSubmit = async()=>{
        let validate = false;
        if(forgetdata!==undefined){
            validate = validationHandleForget();
        }
        if(validate&&forgetdata!==undefined){
            let call_api =  new Customer();
            let link_api = "http://127.0.0.1:8000/api/sanai3i/forgetPassword";
            let returnedData = await call_api.Postdata(link_api,{...forgetdata,type:type});
            setMassage({...returnedData});
            if(returnedData.message==="تم ارسال كلمة السر الى البريد الالكترونى"){
                sessionStorage.setItem('token',returnedData.remember_token);
                sessionStorage.setItem('currentid',returnedData.id);
                const MySwal = withReactContent(Swal);
                MySwal.fire({
                    title: <strong>{returnedData.message}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'success',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                }).then(function() {
                });
            }else{
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>{returnedData.message}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'error',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                })
            }
        }
    }
    return (
        <div className='land container'>
            {(!openforget)?<form className='signup-form' onSubmit={(e)=>{
                e.preventDefault();
                handelSubmit();
            }}>
                <h3 className='fs-5'>تسجيل دخول</h3>
                <i className="bi bi-x-square-fill" onClick={()=>{
                    setState('');
                }}></i>
                <p dir='rtl' className='fs-6 text-danger my-1 mb-2'>{((massage!==undefined&&massage.error!==undefined)&&massage.error)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-3' value={(data!==undefined&&data.email!==undefined)?(data.email):''} type={'email'} onChange={(e)=>{
                        setData({...data,email:e.target.value});
                    }}/>
                    <span>البريد الالكترونى</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.email!==undefined)&&massage.email)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-1' type={'password'}  onChange={(e)=>{
                        setData({...data,password:e.target.value});
                    }}/>
                    <span>الرقم السرى</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.password!==undefined)&&massage.password)}</p>
                <div className='w-100 d-flex justify-content-between my-2'>
                    <div>
                        <label htmlFor="w">الدخول كعامل</label>
                        <input required className='ms-1 radio' checked={type==='w'&&true} type={"radio"} id="w" value="w" name="type" onChange={(e)=>{
                            setType('w');
                        }}/>
                    </div>
                    <div>
                        <label htmlFor="c">الدخول كعميل</label>
                        <input  required className='ms-1 radio' checked={type==='c'&&true} type={"radio"} id="c" value="c" name="type" onChange={(e)=>{
                            setType('c');
                        }}/>
                    </div>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.type!==undefined)&&massage.type)}</p>
                <p className='mb-2 mx-auto' onClick={()=>{
                    setopenForget(true);
                    setData(undefined);
                }} style={{textDecorationLine:'underline',cursor:'pointer'}}>هل نسيت الرقم السرى ؟</p>
                <button type="submit" className={`btn w-100 btn-brand btn-primary`}>دخول</button>
            </form>
            :<form className='signup-form' onSubmit={(e)=>{
                e.preventDefault();
                handelforgetSubmit();
            }}>
                <h3 className='fs-5'>نسيان الرقم السرى</h3>
                <i className="bi bi-x-square-fill" onClick={()=>{
                    setopenForget(false);
                    setForgetData(undefined);
                }}></i>
                <p dir='rtl' className='fs-6 text-danger my-1 mb-2'>{((massage!==undefined&&massage.error!==undefined)&&massage.error)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-3'  value={(forgetdata!==undefined&&forgetdata.email!==undefined)?(forgetdata.email):''} type={'email'} onChange={(e)=>{
                        setForgetData({...forgetdata,email:e.target.value});
                    }}/>
                    <span>البريد الالكترونى</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.email!==undefined)&&massage.email)}</p>
                <div className='w-100 d-flex justify-content-between my-2'>
                    <div> 
                            <label htmlFor="w">الدخول كعامل</label>
                            <input required className='ms-1 radio' checked={type==='w'&&true} type={"radio"} id="w" value="w" name="type" onChange={(e)=>{
                                setType('w');
                            }}/>
                    </div>
                    <div>
                            <label htmlFor="c">الدخول كعميل</label>
                            <input  required className='ms-1 radio' checked={type==='c'&&true} type={"radio"} id="c" value="c" name="type" onChange={(e)=>{
                                setType('c');
                            }}/>
                    </div>
                </div>
                <button type="submit" className={`btn w-100 btn-brand btn-primary`}>استرداد الرقم السرى</button>
            </form>}
        </div>
    )
}
export default Login;

import React, { useState } from 'react'
import Admin from '../../logic/admin';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
export default function AdminLogin() {
    const [data,setData] = useState(undefined);
    let [massage,setMassage] = useState(undefined);
    let navigator = useNavigate();
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
        const regexEmail = /.{1,}@gmail.com/;
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
    const handelSubmit = async()=>{
        let validate = false;
        if(data!==undefined){
            validate = validationHandle();
        }
        if(validate&&data!==undefined){
            let call_api = new Admin();
            let link_api = "http://127.0.0.1:8000/api/auth-admin/login";
            let returnedData = await call_api.Postdata(link_api,{...data});
            setMassage({...returnedData});
            if(returnedData.remember_token!==undefined){
                sessionStorage.setItem('adminToken',returnedData.remember_token);
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>{returnedData.msg}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'success',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق'
                }).then(function() {
                    navigator('/admin');
                });
            }else{
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>{returnedData.error}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'error',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق'
                });
            }
        }
    }
return (
    <div className='admin-login'>
        <form className='signup-form' onSubmit={(e)=>{
            e.preventDefault();
            handelSubmit();
        }}>
            <h3 className='fs-5'>تسجيل دخول</h3>
            <p dir='rtl' className='fs-6 text-danger my-1 mb-2'>{((massage!==undefined&&massage.error!==undefined)&&massage.error)}</p>
            <div className='control-anim'>
                <input className='form-control mb-3'  type={'email'} onChange={(e)=>{
                    setData({...data,email:e.target.value});
                }}/>
                <span>الايميل</span>
            </div>
            {(((massage!==undefined&&massage.email!==undefined)))&&<p className='fs-6 text-danger'>{massage.email}</p>}
            <div className='control-anim'>
                <input className='form-control mb-1'  type={'password'} onChange={(e)=>{
                    setData({...data,password:e.target.value});
                }}/>
                <span>الرقم السرى</span>
            </div>
            {(((massage!==undefined&&massage.password!==undefined)))&&<p className='fs-6 text-danger'>{massage.password}</p>}
            <button type="submit" className={`btn w-100 btn-brand btn-primary`}>دخول</button>
        </form>
    </div>
)
}

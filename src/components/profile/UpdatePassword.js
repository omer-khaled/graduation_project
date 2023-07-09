import React, { useState } from 'react'
import Customer from '../../logic/customer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Worker from '../../logic/worker';

export default function UpdatePassword({children,role,profileDataID,setShowUpdatePassword}) {
        let [data,setData] = useState({});
        let [massage,setMassage] = useState(undefined);
        const validationHandle = ()=>{
            let returnvalue = true;
            let validating = {};
            let feilds = [
                "old_password",
                'new_password',
                'new_password_confirmation',
            ]
            let feildsarabic = [
                "الرقم السرى الحالى",
                'الرقم السرى الجديد',
                'تاكيد الرقم السرى الجديد',
            ]
            feilds.forEach((el,index)=>{
                if(data[el]===undefined||data[el]===''){
                    validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                    returnvalue = false;
                }
                else if((data[el]).length<8){
                    validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ 8 حروف`;
                    returnvalue = false;
                }else if(el==='new_password_confirmation'&&data['new_password']!==data['new_password_confirmation']){
                    validating[el] = `برجاء كتابه تاكيد الرقم السرى الجديد بنفس الشكل الرقم السرى الجديد`;
                    returnvalue = false;
                }
                else{
                    validating[el] = undefined;
                }
            });
            setMassage({...validating});
            return returnvalue;
        }
        const submitHandel = async()=>{
            let validate = false;
            if(data!==undefined){
                validate = validationHandle();
            }
            if(validate&&data!==undefined){
                let call_api = (role!=='c')?new Worker():new Customer();
                let link_api = (role!=='c')?`http://127.0.0.1:8000/api/sanai3i/worker/password/${profileDataID}`:`http://127.0.0.1:8000/api/sanai3i/customer/password/${profileDataID}`;
                let worker_token = sessionStorage.getItem('token');
                let obj = {...data};
                let returnedData =await call_api.Postdata(link_api,obj,{"remember_token":worker_token});
                const MySwal = withReactContent(Swal);
                if(returnedData.message==="Password updated successfully"){
                    MySwal.fire({
                        title: <strong>{"تم تعديل الرقم السرى بنجاح"}</strong>,
                        html: <i>اضغط على الزر للاستكمال</i>,
                        icon: "success",
                        confirmButtonColor: '#0753b9',
                        confirmButtonText:'موافق',
                    }).then(()=>{
                        setShowUpdatePassword(false);
                    });
                }else{
                    MySwal.fire({
                        title: <strong>{"حدث مشكله اثناء تحديث الرقم السرى برجاء التاكد من الرقم السرى الحالى"}</strong>,
                        html: <i>اضغط على الزر للاستكمال</i>,
                        icon:"error",
                        confirmButtonColor: '#0753b9',
                        confirmButtonText:'موافق',
                    })
                }
            }
        }
        return (
            <div className='edit-container'>
                <div className='edit'>
                    <form className='signup-form' onSubmit={(e)=>{
                        e.preventDefault();
                        submitHandel();
                    }}>
                        <h3 className='fs-5'>تعديل الرقم السرى</h3>
                        {children}
                        <div className='control-anim'>
                            <input className='form-control mb-3' dir='rtl' type={'password'}  onChange={(e)=>{
                                setData({...data,old_password:e.target.value})
                            }}/>
                            <span>الرقم السرى الحالى</span>
                        </div>
                        {(((massage!==undefined&&massage.old_password!==undefined)))&&<p className='fs-6 text-danger'>{massage.old_password}</p>}
                        <div className='control-anim'>
                            <input className='form-control mb-3'  dir='rtl' type={'password'}  onChange={(e)=>{
                                setData({...data,new_password:e.target.value})
                            }}/>
                            <span>الرقم السرى الجديد</span>
                        </div>
                        {(((massage!==undefined&&massage.new_password!==undefined)))&&<p className='fs-6 text-danger'>{massage.new_password}</p>}
                        <div className='control-anim'>
                            <input className='form-control mb-3'  dir='rtl' type={'password'}  onChange={(e)=>{
                                setData({...data,new_password_confirmation:e.target.value})
                            }}/>
                            <span>تاكيد الرقم السرى الجديد</span>
                        </div>
                        {(((massage!==undefined&&massage.new_password_confirmation!==undefined)))&&<p className='fs-6 text-danger'>{massage.new_password_confirmation}</p>}
                        <button type="submit" className={`btn w-100} btn-primary btn-brand`}>ارسال</button>
                    </form>
                </div>
            </div>
        )
}


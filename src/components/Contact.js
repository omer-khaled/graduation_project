import React, { useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Customer from '../logic/customer';

function Contact() {
    let [massage,setMassage] = useState(undefined);
    let [data,setData] = useState(undefined);
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            'name',
            'email',
            'phone',
            'message'
        ]
        let feildsarabic = [
            'الاسم',
            'البريد الالكترونى',
            'رقم الهاتف',
            'رساله'
        ]
        const regexEmail = /.{1,}@gmail.com/;
        const regexPhone = /^\d{11}$/;
        const regexName = /^[\u0600-\u06FF\s]{2,25}$/;
        feilds.forEach((el,index)=>{
            if(data[el]===undefined||data[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }else if(el==='name'&&!regexName.test(data[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ حرفين الى 20 احرف واستخدام حروف فقط`;
                returnvalue = false;
            }
            else if(el==='email'&&!regexEmail.test((data[el]))){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح ...@gmail.com`;
                returnvalue = false;
            }else if(el==='phone'&&!regexPhone.test(data[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح مكون من 11 رقم فقط`;
                returnvalue = false;
            }
            else{
                validating[el] = undefined;
            }
        });
        setMassage({...validating});
        return returnvalue;
    }
    const handelSubmit  = async()=>{
        let validate = false;
        if(data!==undefined){
            validate = validationHandle();
        }
        if(validate&&data!==undefined){
            let call_api =new Customer();
            let link_api = "http://127.0.0.1:8000/api/auth-worker/contactus";
            console.log(data);
            let returnedData = await call_api.Postdata(link_api,{...data});
            setMassage({...returnedData});
            console.log({...returnedData});
            if(returnedData.message==='تم إرسال الرسالة بنجاح'){
                const MySwal = withReactContent(Swal);
                MySwal.fire({
                    title: <strong>{returnedData.message}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'success',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                }).then(function() {
                    setData({});
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
        <div className='contact'>
            <div className='container'>
                <form className='contact-form' onSubmit={(e)=>{
                    e.preventDefault();
                    handelSubmit();
                }}>
                    <h3 className='fs-5'>تواصل معنا</h3>
                    <div className='control-anim'>
                        <input className='form-control mb-3' type={'text'} onChange={(e)=>{
                            setData({...data,name:e.target.value});
                        }}/>
                        <span>الاسم</span>
                    </div>
                    <p className='fs-6 text-danger '>{((massage!==undefined&&massage.name!==undefined)&&massage.name)}</p>
                    <div className='control-anim'>
                        <input className='form-control mb-3'  type={'email'} onChange={(e)=>{
                            setData({...data,email:e.target.value});
                        }}/>
                        <span>الايميل</span>
                    </div>
                    <p className='fs-6 text-danger '>{((massage!==undefined&&massage.email!==undefined)&&massage.email)}</p>
                    <div className='control-anim'>
                        <input className='form-control mb-3' type={'phone'} onChange={(e)=>{
                            setData({...data,phone:e.target.value});
                        }}/>
                        <span>رقم الهاتف</span>
                    </div>
                    <p className='fs-6 text-danger '>{((massage!==undefined&&massage.phone!==undefined)&&massage.phone)}</p>
                    <div className='control-anim'>
                        <textarea className="form-control mb-3"  id="exampleFormControlTextarea1" onChange={(e)=>{
                            setData({...data,message:e.target.value});
                        }}></textarea>
                        <span>الرساله</span>
                    </div>
                    <p className='fs-6 text-danger'>{((massage!==undefined&&massage.message!==undefined)&&massage.message)}</p>
                    <button style={{background:"var(--brand-color)",borderColor:"var(--brand-color)"}} type="submit" className="btn w-100 btn-primary btn-brand">ارسل</button>
                </form>
            </div>
        </div>
    )
}
export default Contact;

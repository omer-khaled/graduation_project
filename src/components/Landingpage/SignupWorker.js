import React, {  useContext, useEffect, useState } from 'react'
import { context } from '../LandingPage';
import Customer from '../../logic/customer';
import Worker from '../../logic/worker';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
function SignupWorker({type}) {
    let navigator = useNavigate();
    let {setState} = useContext(context);
    let [data,setData] = useState(undefined);
    let [confirmPassword,setconfirmPassword] = useState(undefined);
    let [confirmPasswordError,setconfirmPasswordError] = useState(undefined);
    let [massage,setMassage] = useState(undefined);
    let [region,setRegion] = useState(undefined);
    let [categories,setCategories] = useState(undefined);
    // const [validation,setvalidations] = useState({});
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            "password",
            'city_id',
            'address',
            'phone',
            'email',
            'name'
        ]
        let feildsarabic = [
            "الرقم السرى",
            'المدينه',
            'العنوان',
            'رقم الهاتف',
            'البريد الالكترونى',
            'الاسم'
        ]
        const regexEmail = /^.{1,}@gmail.com$/;
        const regexPhone = /^\d{11}$/;
        const regexName = /^[\u0600-\u06FF\s]{2,25}$/;
        if(type){
            feilds.push('initial_price');
            feilds.push('category_id');
            feildsarabic.push('القسم');
            feildsarabic.push('السعر المبدأى');
        }
        feilds.forEach((el,index)=>{
            if(data[el]===undefined||data[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }else if(el==='password'&&(data[el]).length<8){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ 8 حروف`;
                returnvalue = false;
            }else if(el==='name'&&!regexName.test(data[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ حرفين الى 25 احرف واستخدام حروف فقط`;
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
        if(data.password!==confirmPassword){
            setconfirmPasswordError('تاكد ان الرقم السرى و تاكيد الرقم السرى نفس الشئ');
        }else{
            setconfirmPasswordError(undefined);
        }
        setMassage({...validating});
        return returnvalue;
    }
    const handelSubmit = async()=>{
        if(data!==undefined){
            let call_api = (type===true)?new Worker():new Customer();
            let link_api = (type===true)?"http://127.0.0.1:8000/api/auth-worker/worker/register":"http://127.0.0.1:8000/api/auth-customer/customer/register";
            const validate = validationHandle();
            if(data.password===confirmPassword&&validate){
                let returnedData = await call_api.Postdata(link_api,{...data});
                if(returnedData.message==="تم التسجيل بنجاح افحص البريد الالكتروني"){
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                        title: <strong>{returnedData.message}</strong>,
                        html: <i>اضغط على الزر</i>,
                        icon: 'success',
                        confirmButtonColor: '#0753b9',
                        confirmButtonText:'موافق',
                    }).then(function() {
                        navigator(0);
                    });
                }else{
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                        title: <strong>{(returnedData.error!==undefined)?returnedData.error:returnedData.message}</strong>,
                        html: <i>اضغط على الزر</i>,
                        icon: 'error',
                        confirmButtonColor: '#0753b9',
                        confirmButtonText:'موافق',
                    }).then(function() {
                        navigator(0);
                    });
                    // setMassage({...returnedData});
                }
            }else{
                // setconfirmPasswordError('تاكد ان الرقم السرى و تاكيد الرقم السرى نفس الشئ');
            }
        }
    }
    const getRegions = async()=>{
        let call_api = new Worker();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/all-region";
        let returnedData = await call_api.getAlldata(link_api);
        setRegion([...({...returnedData}.region)]);
    }
    const getCategories = async()=>{
        let call_api = new Worker();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/categories";
        let returnedData = await call_api.getAlldata(link_api);
        setCategories([...({...returnedData}.categories)]);
    }
    useEffect(()=>{
        getRegions();
        getCategories();
    },[])
    return (
        <div className='land container'>
            <form className='signup-form mt-2' onSubmit={(e)=>{
                e.preventDefault();
                handelSubmit();
            }}>
                <h3 className='fs-5'>انشاء حساب</h3>
                <i className="bi bi-x-square-fill" onClick={()=>{
                    setState('');
                }}></i>
                <div className='control-anim'>
                    <input className='form-control mb-3'  type={'text'} onChange={(e)=>{
                        setData({...data,name:e.target.value});
                    }}/>
                    <span>الاسم</span>
                </div>
                <p className='fs-6 text-danger  '>{((massage!==undefined&&massage.name!==undefined)&&massage.name)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-3'   type={'email'} onChange={(e)=>{
                        setData({...data,email:e.target.value});
                    }}/>
                    <span>البريد الالكترونى</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.email!==undefined)&&massage.email)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-3'   type={'phone'} onChange={(e)=>{
                        setData({...data,phone:e.target.value});
                    }}/>
                    <span>رقم الهاتف</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.phone!==undefined)&&massage.phone)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-3'  type={'text'} id="street-address" name="street-address" autoComplete="street-address"  enterKeyHint='next' onChange={(e)=>{
                        setData({...data,address:e.target.value});
                    }}/>
                    <span>اسم الشارع</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.address!==undefined)&&massage.address)}</p>
                <div className='control-anim'>
                    <select className="form-select mb-3"  aria-label="Default select example" onChange={(e)=>{
                        setData({...data,city_id:e.target.value});
                    }}>
                        <option defaultValue={"اختار مدينه"}></option>
                        {region!==undefined&&
                            region.map((el)=>{
                                return (<option key={el.id} value={el.id}>{el.city_name}</option>);
                            })
                        }
                    </select>
                    <span>اسم المدينه</span>
                </div>
                <p className='fs-6 text-danger '>{((massage!==undefined&&massage.city_id!==undefined)&&massage.city_id)}</p>
                {(type===true)?<div className='control-anim'>
                    <input className='form-control mb-3' type={"number"} id="initial_price" name="initial_price"  onChange={(e)=>{
                        setData({...data,initial_price:Number(e.target.value)});
                    }}/>
                    <span>السعر الابتدائى</span>
                    </div>:<React.Fragment></React.Fragment>
                }
                {(type===true)&& <p className='fs-6 text-danger '>{((massage!==undefined&&massage.initial_price!==undefined)&&massage.initial_price)}</p>}
                {(type===true)?<div className='control-anim'>
                    <select className="form-select mb-3"  aria-label="Default select example" onChange={(e)=>{
                        setData({...data,category_id:e.target.value});
                    }}>
                        <option defaultValue={""}></option>
                        {categories!==undefined&&
                            categories.map((el)=>{
                                return (<option key={el.id} value={el.id}>{el.name}</option>);
                            })
                        }
                    </select>
                    <span>الاقسام</span>
                    </div>:<React.Fragment></React.Fragment>
                }
                {(type===true)&& <p className='fs-6 text-danger '>{((massage!==undefined&&massage.category_id!==undefined)&&massage.category_id)}</p>}
                <div className='control-anim'>
                    <input className='form-control mb-3'  type={'password'} onChange={(e)=>{
                        setData({...data,password:e.target.value});
                    }}/>
                    <span>الرقم السرى</span>
                </div>
                <p className='fs-6 text-danger'>{((massage!==undefined&&massage.password!==undefined)&&massage.password)}</p>
                <div className='control-anim'>
                    <input className='form-control mb-3'  type={'password'} onChange={(e)=>{
                        setconfirmPassword(e.target.value);
                    }}/>
                    <span>تاكيد الرقم السرى</span>
                </div>
                {(confirmPasswordError!==undefined)&&<div className='text-danger text-center w-100'>{confirmPasswordError}</div>}
                <button type="submit" className={`btn w-100 btn-primary btn-brand`}>انشاء</button>
            </form>
        </div>
    )
}
export default SignupWorker;

// {(type===true)&&<div className='control-anim'>
// <input className='form-control mb-3' type={"file"} onChange={(e)=>{
//     setData({...data,btaka:e.target.value});
// }}/>
// <span>رفع صوره البطاقه</span>
// </div>}
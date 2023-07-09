import React, { useContext, useEffect, useState } from 'react'
import Worker from '../../logic/worker';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { profileStore } from '../ProfileWorker';
import Customer from '../../logic/customer';
function Edit({type,children,role,id,profileData}) {
    let [file,setFile] = useState((profileData.image!==undefined)?`data:image/png;base64, ${profileData.image}`:undefined); 
    let [perveiousImage,setPreviousImage] = useState((profileData.image!==undefined)?profileData.image:undefined);
    let [data,setData] = useState(
        (role!=='c')?{   name:profileData.name,
            category_id:profileData.Category.id,
            city_id:profileData.Region.id,
            image:(profileData.image!==undefined)?profileData.image:undefined,
            phone:profileData.phone,
            address:profileData.address,
            email:profileData.email,
            initial_price:profileData.initial_price
        }:{   name:profileData.name,
            city_id:profileData.Region.id,
            image:(profileData.image!==undefined)?profileData.image:undefined,
            phone:profileData.phone,
            address:profileData.address,
            email:profileData.email,
        });
    let {profileEdit,setProfileEdit} = useContext(profileStore);
    let [region,setRegion] = useState(undefined);
    let [categories,setCategories] = useState(undefined);
    let [massage,setMassage] = useState(undefined);
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
        (role!=='c')&&getCategories();
    },[])
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            'city_id',
            'address',
            'phone',
            'name',
            'image'
        ]
        let feildsarabic = [
            'المدينه',
            'العنوان',
            'رقم الهاتف',
            'الاسم',
            'الصوره'
        ]
        const regexPhone = /^\d{11}$/;
        const regexName = /^[\u0600-\u06FF\s]{2,25}$/;;
        const imagetyps = ['image/png','image/jpeg','image/jpg'];
        if(role!=='c'){
            feilds.push('initial_price');
            feilds.push('category_id');
            feildsarabic.push('السعر المبدأى');
            feildsarabic.push('القسم');
        }
        feilds.forEach((el,index)=>{
            if((data[el]===undefined||data[el]==='')&&el!=='image'){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }else if(el==='name'&&!regexName.test(data[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ حرفين الى 10 احرف واستخدام حروف فقط`;
                returnvalue = false;
            }else if(el==='phone'&&!regexPhone.test(data[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح مكون من 11 رقم فقط`;
                returnvalue = false;
            }else if(el==='image'&&data[el]!==perveiousImage&&!imagetyps.includes((data[el]).type)){
                console.log(data[el]);
                validating[el] = `برجاء رفع صور فقط`;
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
        if(validate&&data!==undefined)
        {
            let call_api = (role!=='c')?new Worker():new Customer();
            let link_api = (role!=='c')?`http://127.0.0.1:8000/api/sanai3i/worker/update_profile`:`http://127.0.0.1:8000/api/sanai3i/customer/update_profile`;
            let worker_token = sessionStorage.getItem('token');
            let obj = {...data};
            const formData = new FormData();
            formData.append('name', obj.name);
            (obj.image!==undefined)&&((typeof (obj.image))!=="string")&&formData.append('image', obj.image);
            formData.append('phone', obj.phone);
            formData.append('address', obj.address);
            formData.append('city_id', obj.city_id);
            (role!=='c')&&formData.append('category_id', obj.category_id);
            (role!=='c')&&formData.append('initial_price', obj.initial_price);
            let returnedData =await call_api.dealdataCategory(link_api,formData,{"remember_token":worker_token},id);
            const MySwal = withReactContent(Swal);
            setProfileEdit(!profileEdit);
            if(((returnedData.data.message)==="تم تعديل البيانات بنجاح")||(String(returnedData.data).includes('message'))){
                MySwal.fire({
                    title: <strong>{"تم تعديل البيانات بنجاح"}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "success",
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                });
            }else{
                MySwal.fire({
                    title: <strong>{"لم يتم تعديل الحساب"}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "error",
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                });
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
                    <h3 className='fs-5'>تعديل الملف الشخصى</h3>
                    {children}
                    <div className='avatar-edit'>
                        <div className='icon'>
                            {(file!==undefined)&&<img src={file} alt="personal" />}
                            <input type={"file"}  accept="image/png, image/jpeg, image/jpg" onChange={(e)=>{
                                let src = e.target.files[0];
                                setFile(URL.createObjectURL(src));
                                setData({...data,image:(e.target.files[0])})
                            }}/>
                            <i className="bi bi-camera-fill"></i>
                        </div>
                    </div>
                    {(((massage!==undefined&&massage.image!==undefined)))&&<p className='fs-6 text-danger'>{massage.image}</p>}
                    <div className='control-anim'>
                        <input className='form-control mb-3' type={'text'} value={(data.name!==undefined&&data.name)} onChange={(e)=>{
                            setData({...data,name:e.target.value})
                        }}/>
                        <span>الاسم</span>
                    </div>
                    {(((massage!==undefined&&massage.name!==undefined)))&&<p className='fs-6 text-danger'>{massage.name}</p>}
                    <div className='control-anim'>
                        <input disabled className='form-control mb-3' type={'email'} value={(data.email!==undefined&&data.email)} onChange={(e)=>{
                            // setpirthday(e.target.value);
                        }}/>
                        <span className='dis-email'>الايميل</span>
                    </div>
                    {(role!=='c')&&<div className='control-anim'>
                        <input className='form-control mb-3' type={'number'} value={(data.initial_price!==undefined&&Number(data.initial_price))} onChange={(e)=>{
                            setData({...data,initial_price:Number(e.target.value)})
                        }}/>
                        <span className=''>السعر المبدأى</span>
                    </div>}
                    {(role!=='c')&&(((massage!==undefined&&massage.initial_price!==undefined)))&&<p className='fs-6 text-danger'>{massage.initial_price}</p>}
                    <div className='control-anim'>
                        <input className='form-control mb-3' type={'phone'} value={(data.phone!==undefined&&data.phone)} onChange={(e)=>{
                            setData({...data,phone:e.target.value})
                        }}/>
                        <span>رقم الهاتف</span>
                    </div>
                    {(((massage!==undefined&&massage.phone!==undefined)))&&<p className='fs-6 text-danger'>{massage.phone}</p>}
                    <div className='control-anim'>
                        <input className='form-control mb-3' type={'text'} id="street-address" name="street-address" autoComplete="street-address" value={(data.address!==undefined&&data.address)}  enterKeyHint='next' onChange={(e)=>{
                            setData({...data,address:e.target.value})
                        }}/>
                        <span>اسم الشارع</span>
                    </div>
                    {(((massage!==undefined&&massage.address!==undefined)))&&<p className='fs-6 text-danger'>{massage.address}</p>}
                    <div className='control-anim'>
                    <select className="form-select mb-3"  value={(data.city_id!==undefined&&data.city_id)} aria-label="Default select example" onChange={(e)=>{
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
                    {(((massage!==undefined&&massage.city_id!==undefined)))&&<p className='fs-6 text-danger'>{massage.city_id}</p>}
                    {((role!=='c'))?<div className='control-anim'>
                        <select className="form-select mb-3"  value={(data.category_id!==undefined&&data.category_id)} aria-label="Default select example" onChange={(e)=>{
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
                    {(((massage!==undefined&&massage.category_id!==undefined&&role!=='c')))&&<p className='fs-6 text-danger'>{massage.category_id}</p>}
                    <button type="submit" className={`btn w-100 ${(type===true)&&'mt-3'} btn-primary btn-brand`}>تعديل</button>
                </form>
            </div>
        </div>
    )
}
export default Edit;

import React, { useEffect, useState } from 'react'
import Admin from '../../logic/admin';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import personalImage from '../../Assets/images/user.jpg';
export default function Categories() {
    let [categories,setCategories] = useState(undefined);
    let [updatedata,setUpdateData] = useState(undefined);
    let [data,setData] = useState(undefined);
    let [show,setShow] = useState(false);
    let [showAdd,setShowAdd] = useState(false);
    // let [objectGoal , setobjectGoal] = useState({});
    let [sourc,setSourc] = useState('');
    let [sourcadd,setSourcAdd] = useState('');
    let [massage,setMassage] = useState(undefined);
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            "name",
            'description',
        ]
        let feildsarabic = [
            "اسم القسم",
            'الوصف',
        ]
        const regexName = /^[\u0600-\u06FF\s]{2,20}$/;
        feilds.forEach((el,index)=>{
            if(data[el]===undefined||data[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }else if(el==='name'&&!regexName.test(data[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ حرفين الى 20 احرف واستخدام حروف فقط باللغه العربيه`;
                returnvalue = false;
            }
            else{
                validating[el] = undefined;
            }
        });
        setMassage({...validating});
        return returnvalue;
    }
    const validationHandleupdatedata = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            "name",
            'description',
        ]
        let feildsarabic = [
            "اسم القسم",
            'الوصف',
        ]
        const regexName = /^[\u0600-\u06FF\s]{2,20}$/;
        feilds.forEach((el,index)=>{
            if(updatedata[el]===undefined||updatedata[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
                returnvalue = false;
            }else if(el==='name'&&!regexName.test(updatedata[el])){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح باقل شئ حرفين الى 20 احرف واستخدام حروف فقط باللغه العربيه`;
                returnvalue = false;
            }
            else{
                validating[el] = undefined;
            }
        });
        setMassage({...validating});
        return returnvalue;
    }
    useEffect(()=>{
        getdata();
    },[]);
    const getdata = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/categories";
        let returnedData = await call_api.getAlldata(link_api);
        let categos = [...(returnedData.categories)];
        setCategories([...categos]);
    }
    const submitUpdate = async()=>{
        let validate = false;
        if(updatedata!==undefined){
            validate = validationHandleupdatedata();
        }
        if(validate&&updatedata!==undefined){
            let call_api = new Admin();
            let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/category";
            let admin_token = sessionStorage.getItem('adminToken');
            let obj = {...updatedata};
            const formData = new FormData();
            ((obj.name)!==undefined)&&formData.append('name', obj.name);
            ((obj.description)!==undefined)&&formData.append('description', obj.description);
            ((obj.image)!==undefined&&(typeof (obj.image))!=="string")&&formData.append('image', obj.image);
            let returnedData =await call_api.dealdataCategory(link_api,formData,{"remember_token":admin_token},obj.id);
            const MySwal = withReactContent(Swal);
            console.log(returnedData);
            if((returnedData.data!==undefined)&&returnedData.data.message==='تم تعديل القسم بنجاح'){
                MySwal.fire({
                    title: <strong>{returnedData.data.message}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "success",
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                    }).then(function() {
                        getdata();
                        setShow(false);
                        setSourc('');
                    });
            }else{
                MySwal.fire({
                    title: <strong>{"الاسم موجود بالفعل"}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "error",
                    confirmButtonText:'موافق',
                    confirmButtonColor: '#0753b9',
                    });
            }
        }
    }
    const submitAdd = async()=>{
        let validate = false;
        if(data!==undefined){
            validate = validationHandle();
        }
        if(validate&&data!==undefined){
            let call_api = new Admin();
            let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/category";
            let admin_token = sessionStorage.getItem('adminToken');
            let obj = {...data};
            const formData = new FormData();
            formData.append('name', obj.name);
            formData.append('description', obj.description);
            formData.append('image', obj.image);
            let returnedData =await call_api.dealdataCategory(link_api,formData,{"remember_token":admin_token});
            const MySwal = withReactContent(Swal);
            if(returnedData.data.message==='تم اضافة القسم بنجاح'){
                MySwal.fire({
                    title: <strong>{returnedData.data.message}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "success",
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                    }).then(function() {
                        getdata();
                        setShowAdd(false);
                        setSourc('');
                    });
            }else{
                MySwal.fire({
                    title: <strong>{"الاسم موجود بالفعل"}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "error",
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                    });
            }
        }
    }
    return (
        <div className='cont'>
            <h1>Categories</h1>
            <div className='users'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h2>Categories</h2>
                    <button className='b-blue add_but ms-3' onClick={async(e)=>{
                        setShowAdd(true);
                        setMassage(undefined);
                    }}>اضافه تخصص جديد</button>
                </div>
                <div className="table-responsive">
                    {(categories!==undefined)?((categories.length!==0)?<table dir="rtl" width={"100%"}>
                        <thead width={"100%"}>
                            <tr>
                                <th width={"((100%-70px)/4)"}>الاسم</th>
                                <th width={"((100%-70px)/4)"}>الوصف</th>
                                <th width={"((100%-70px)/4)"}>تاريخ الانشاء</th>
                                <th width={"((100%-70px)/4)"}>التحكم</th>
                            </tr>
                        </thead>
                        <tbody width={"100%"}>
                            {
                                (categories.map((el,index)=>{
                                    let date = new Date(el.created_at);
                                    return(
                                        <tr key={el.id}>
                                            <td width={"(100/5)%"}>{el.name}</td>
                                            <td width={"(100/5)%"}>{el.description}</td>
                                            <td width={"(100/5)%"}>{`${(date).getDate()}-${(date).getMonth()+1}-${(date).getFullYear()}`}</td>
                                            <td width={"(100/5)%"}>
                                                <div className="d-flex justify-content-around align-items-center">
                                                    <button className='b-green' onClick={async(e)=>{
                                                        setShow(true);
                                                        setMassage(undefined);
                                                        // setobjectGoal({...el});
                                                        setUpdateData({...el})
                                                    }}>تعديل</button>
                                                    <button className='b-red' onClick={async(e)=>{
                                                        let call_api = new Admin();
                                                        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/categories";
                                                        let admin_token = sessionStorage.getItem('adminToken');
                                                        let returnedData =await call_api.Deletdata(link_api,el.id,{"remember_token":admin_token});
                                                        const MySwal = withReactContent(Swal)
                                                        MySwal.fire({
                                                            title: <strong>{returnedData.message}</strong>,
                                                            html: <i>اضغط على الزر للاستكمال</i>,
                                                            icon: 'success',
                                                            confirmButtonColor: '#0753b9',
                                                            confirmButtonText:'موافق',
                                                        }).then(function() {
                                                            getdata();
                                                        });
                                                    }}>حذف</button>
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }))
                            }
                        </tbody>
                    </table>:<div className="text-center">لا يوجد اقسام</div>):<div className='w-100 d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>}
                </div>
            </div>
            {(show)&&<div className='coverform'>
                    <form className='signup-form custom-form' onSubmit={(e)=>{
                        e.preventDefault();
                        submitUpdate();
                    }}>
                        <h3 className='fs-5'>تعديل تخصص</h3>
                        <i className="bi bi-x-square-fill" onClick={()=>{
                            setShow(false);
                            setSourc('');
                        }}></i>
                        <div className='control-anim'>
                            <input className='form-control mb-3' value={(updatedata.name!==undefined&&updatedata.name)} type={'text'} onChange={(e)=>{
                                setUpdateData({...updatedata,name:e.target.value});
                            }}/>
                            <span>الاسم</span>
                        </div>
                        {(((massage!==undefined&&massage.name!==undefined)))&&<p className='fs-6 text-danger'>{massage.name}</p>}
                        <div className='control-anim'>
                            <input className='form-control mb-1' value={(updatedata.description!==undefined&&updatedata.description)} type={'text'} onChange={(e)=>{
                                setUpdateData({...updatedata,description:e.target.value});
                            }}/>
                            <span>الوصف</span>
                        </div>
                        {(((massage!==undefined&&massage.description!==undefined)))&&<p className='fs-6 text-danger'>{massage.description}</p>}
                        <button type="submit" className={`btn w-100 btn-brand btn-primary`}>تعديل</button>
                    </form>
            </div>}
            {(showAdd)&&<div className='coverform'>
                <form className='signup-form custom-form' onSubmit={(e)=>{
                    e.preventDefault();
                    submitAdd();
                }}>
                    <h3 className='fs-5'>اضافه تخصص</h3>
                    <i className="bi bi-x-square-fill" onClick={()=>{
                        setShowAdd(false);
                        setSourcAdd('');
                    }}></i>
                    <div className='control-anim'>
                        <input className='form-control mb-3'  type={'text'} onChange={(e)=>{
                            setData({...data,name:e.target.value});
                        }}/>
                        <span>الاسم</span>
                    </div>
                    {(((massage!==undefined&&massage.name!==undefined)))&&<p className='fs-6 text-danger'>{massage.name}</p>}
                    <div className='control-anim'>
                        <input className='form-control mb-1'  type={'text'} onChange={(e)=>{
                            setData({...data,description:e.target.value});
                        }}/>
                        <span>الوصف</span>
                    </div>
                    {(((massage!==undefined&&massage.description!==undefined)))&&<p className='fs-6 text-danger'>{massage.description}</p>}
                    <button type="submit" className={`btn w-100 btn-brand btn-primary`}>اضافه</button>
                </form>
            </div>}
        </div>
        
    )
}

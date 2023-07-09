import React, { useEffect, useState } from 'react'
import Admin from '../../logic/admin';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
export default function Regions() {
        let [categories,setCategories] = useState(undefined);
    let [updatedata,setUpdateData] = useState(undefined);
    let [data,setData] = useState(undefined);
    let [showAdd,setShowAdd] = useState(false);
    // let [objectGoal , setobjectGoal] = useState({});
    let [sourc,setSourc] = useState('');
    let [sourcadd,setSourcAdd] = useState('');
    let [massage,setMassage] = useState(undefined);
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            "city_name",
            'code',
        ]
        let feildsarabic = [
            "اسم المنطقه",
            'الكود',
        ]
        feilds.forEach((el,index)=>{
            if(data[el]===undefined||data[el]===''){
                validating[el] = `برجاء كتابه ${feildsarabic[index]} بشكل صحيح`;
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
        let link_api = "http://127.0.0.1:8000/api/sanai3i/all-region";
        let returnedData = await call_api.getAlldata(link_api);
        let regions = [...(returnedData.region)];
        setCategories([...regions]);
    }
    const submitAdd = async()=>{
        let validate = false;
        if(data!==undefined){
            validate = validationHandle();
        }
        if(validate&&data!==undefined){
            let call_api = new Admin();
            let link_api = "http://127.0.0.1:8000/api/sanai3i/region/store";
            let admin_token = sessionStorage.getItem('adminToken');
            let obj = {...data};
            let returnedData =await call_api.Postdata(link_api,obj,{"remember_token":admin_token});
            const MySwal = withReactContent(Swal);
            if(returnedData[0]==='تم اضافة المنطقة بنجاح'){
                MySwal.fire({
                title: <strong>{returnedData[0]}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon: (returnedData["0"]===undefined)?"error":"success",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
                }).then(function() {
                    getdata();
                    setShowAdd(false);
                    setSourc('');
                });
            }else{
                MySwal.fire({
                    title: <strong>{"الكود او الاسم موجودين بالفعل"}</strong>,
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
            <h1>Regions</h1>
            <div className='users'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h2>Regions</h2>
                    <button className='b-blue add_but ms-3 py-1' onClick={async(e)=>{
                        setShowAdd(true);
                        setMassage(undefined);
                    }}>اضافه منطقه جديد</button>
                </div>
                <div className="table-responsive">
                    {(categories!==undefined)?((categories.length!==0)?<table dir="rtl" width={"100%"}>
                        <thead width={"100%"}>
                            <tr>
                                <th width={"((100%-70px)/4)"}>الاسم</th>
                                <th width={"((100%-70px)/4)"}>الكود</th>
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
                                            <td width={"(100/5)%"}>{el.city_name}</td>
                                            <td width={"(100/5)%"}>{el.code}</td>
                                            <td width={"(100/5)%"}>{`${(date).getDate()}-${(date).getMonth()+1}-${(date).getFullYear()}`}</td>
                                            <td width={"(100/5)%"}>
                                                <div className="d-flex justify-content-around align-items-center">
                                                    <button className='b-red' onClick={async(e)=>{
                                                        let call_api = new Admin();
                                                        let link_api = "http://127.0.0.1:8000/api/sanai3i/region/delete";
                                                        let admin_token = sessionStorage.getItem('adminToken');
                                                        let returnedData =await call_api.Deletdata(link_api,el.id,{"remember_token":admin_token});
                                                        const MySwal = withReactContent(Swal)
                                                        MySwal.fire({
                                                            title: <strong>{returnedData[0]}</strong>,
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
                    </table>:<div className="text-center">لا يوجد مناطق</div>):<div className='d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>}
                </div>
            </div>
            {(showAdd)&&<div className='coverform'>
                <form className='signup-form custom-form' onSubmit={(e)=>{
                    e.preventDefault();
                    submitAdd();
                }}>
                    <h3 className='fs-5'>اضافه منطقه</h3>
                    <i className="bi bi-x-square-fill" onClick={()=>{
                        setShowAdd(false);
                        setSourcAdd('');
                    }}></i>
                    <div className='control-anim'>
                        <input className='form-control mb-3'  type={'text'} onChange={(e)=>{
                            setData({...data,city_name:e.target.value});
                        }}/>
                        <span>الاسم المنطقه</span>
                    </div>
                    {(((massage!==undefined&&massage.city_name!==undefined)))&&<p className='fs-6 text-danger'>{massage.city_name}</p>}
                    <div className='control-anim'>
                        <input className='form-control mb-3'  type={'number'} onChange={(e)=>{
                            setData({...data,code:e.target.value});
                        }}/>
                        <span>كود</span>
                    </div>
                    {(((massage!==undefined&&massage.code!==undefined)))&&<p className='fs-6 text-danger'>{massage.code}</p>}
                    <button type="submit" className={`btn w-100 btn-brand btn-primary`}>اضافه</button>
                </form>
            </div>}
        </div>
    )
}

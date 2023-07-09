import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Worker from '../../logic/worker';
import { Link  } from 'react-router-dom';
import { profileStore } from '../ProfileWorker';
function Malaf({profileData,id,type,role,owner,worker}) {
    let {profileState,setProfilestate} = useContext(profileStore);
    let {servicesEdit,setServicesEdit} = useContext(profileStore);
    let [desopen,setDesopen] = useState(false);
    let [newnobza,setNewnobza] = useState(profileData.description);
    // const [services,setService] = useState(profileData.Portfolio);
    const [currentImage,setCurrentImage] = useState({open:false,image:undefined});
    let date = new Date(profileData.created_at);
    let datejoin = String(date.toLocaleDateString('ar-eg'));
    // monthNames
    let handelSubmit = async()=>{
        let call_api = new Worker();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/worker/description`;
        let worker_token = sessionStorage.getItem('token');
        const formData = new FormData();
        formData.append('description', newnobza);
        let returnedData =await call_api.dealdataCategory(link_api,formData,{"remember_token":worker_token},id);
        const MySwal = withReactContent(Swal);
        setProfilestate(!profileState);
        MySwal.fire({
            title: <strong>{returnedData.data.message}</strong>,
            html: <i>اضغط على الزر للاستكمال</i>,
            icon: (returnedData.data.message==="تم تعديل البيانات بنجاح")?"success":"error",
            confirmButtonColor: '#0753b9',
            confirmButtonText:'موافق',
        }).then(function() {
            setDesopen(false);
        });
    }
    return (
        <>
            <div className='container main mt-4'>
                <div className='more-details'>
                    <p className='success'>إحصائيات</p>
                    <div className='hr my-3'></div>
                    <div className='details-info'>
                        <div className='sub-details-info mb-2' dir='rtl'>
                            <p className='success'>الخدمات المكتمله</p>
                            <p className='success'>{(profileData.CompletedContracts!==undefined)?profileData.CompletedContracts:'0'}</p>
                        </div>
                        {(role!=='c')&&<div className='sub-details-info mb-2' dir='rtl'>
                            <p className='success'>عدد العملاء</p>
                            <p className='success'>{(profileData.CustomerNumbers!==undefined?profileData.CustomerNumbers:"0")}</p>
                        </div>}
                        <div className='sub-details-info' dir='rtl'>
                            <p className='success'>تاريخ الانضمام</p>
                            <p className='success'>{datejoin}</p>
                        </div>
                    </div>
                </div>
                {(role!=='c')&&<div className='simple-updates'>
                    <div className='nabza'>
                        <div className={`nabze-update ${((owner==='n'&&worker))?'justify-content-between':'justify-content-end'}`}>
                            {(owner==='n'&&worker&&(profileData.id===(Number(sessionStorage.getItem('currentid')))))&&<i className="bi bi-pencil-fill" onClick={(e)=>{
                                    setDesopen(!desopen);
                            }}></i>}
                            {(desopen)?<div className=' w-100'>
                                <form className='d-flex justify-content-between align-items-center w-100 ps-2' onSubmit={(e)=>{
                                    e.preventDefault();
                                    if(newnobza!==""){
                                        handelSubmit();
                                    }
                                }}>
                                    <button className='btn btn-primary text-white me-2'>تعديل</button>
                                    <input required value={(newnobza!==null)?newnobza:''} type='text' className='p-1' style={{flexGrow:1}} id='nob' onChange={(e)=>{
                                        setNewnobza(e.target.value);
                                    }} />
                                    <label htmlFor='nob' className='ms-2 text-dark'>اضف نبذه</label>
                                </form>
                            </div>:<p className='success'>نبذة عني</p>}
                        </div>
                        <div className='hr my-3'></div>
                        {((profileData.description===null)||(profileData.description===""))?<p className='success value'>لم يكتب نبذة شخصية</p>:<p className='success value'>{profileData.description}</p>}
                    </div>
                    <div className='nabza mt-3'>
                        <div className={`nabze-update ${(owner==='n'&&worker)?'justify-content-between':'justify-content-end'}`}>
                            {(worker&&owner==='n'&&(profileData.id===(Number(sessionStorage.getItem('currentid')))))&&<i className="bi bi-pencil-fill" onClick={()=>{
                                setServicesEdit(true);
                            }}></i>}
                            <p className='success'>خدماتي</p>
                        </div>
                        <div className='hr my-3'></div>
                        <div className='row w-100 pb-2 mx-0 justify-content-center align-items-center'>
                            {((profileData.Portfolio)!==undefined)?((((profileData.Portfolio).length)!==0)?(profileData.Portfolio).map((el,index)=>{
                                return(<div key={index} className='col-3 mb-2' onClick={()=>{
                                    setCurrentImage({open:true,image:el});
                                }}>
                                        <img width={"100%"} height={"140px"} style={{
                                            objectFit:'cover',
                                            cursor:'pointer'
                                        }} src={`data:image/png;base64, ${el}`} alt="serviceImage" />
                                    </div>)
                            }):<p className='success value'>لا توجد خدمات بعد</p>):<p className='success value text-center'>لا توجد خدمات بعد</p>}
                        </div>
                    </div>
                </div>}
            </div>
            {(currentImage.open)&&<div className='focus-image'>
                <div>
                        <i className="bi bi-x-square-fill" onClick={()=>{
                            setCurrentImage({open:false,image:undefined});
                        }}></i>
                        <img width={"100%"} height={"140px"} style={{
                            objectFit:'cover'
                        }} src={`data:image/png;base64, ${currentImage.image}`} alt="serviceImage" />
                </div>
            </div>}
        </>
    )
}
export default Malaf;

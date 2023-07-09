import React, { useEffect, useState } from 'react'
import Customer from '../../logic/customer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MakeReportForm from './MakeReportForm';
import Worker from '../../logic/worker';
import MakePriceForm from '../profile/MakePriceForm';
import Payment from '../Payment';
import { Rating } from 'react-simple-star-rating';
import {Link, useNavigate} from 'react-router-dom';
export default function Contract({role}) {
    const navigator = useNavigate();
    let [contracts,setContracts] = useState(undefined);
    const [openreport,setOpenreport] = useState(false);
    const [massage,setMassage] = useState(undefined);
    const [contractDetails,setContractDetails] = useState({
        user_id:"",
        worker_id:"",
        id:"",
        status:""
    });	
    const [curentpaymenttype,setCurentpaymenttype] = useState();
    const [openprice,setOpenPrice] = useState(false);
    const [openpayment,setOpenpayment] = useState(false);
    const [datarateworker,setDataRateWorker] = useState({});
    let getcontracts = async()=>{
        let call_api = (role!=='c')?new Worker():new Customer();
        let link_api = (role!=='c')?`http://127.0.0.1:8000/api/sanai3i/worker/showContracts`:`http://127.0.0.1:8000/api/sanai3i/customer/showContracts`;
        let worker_token = sessionStorage.getItem('token');
        let id = sessionStorage.getItem('currentid');
        let returnedData = await call_api.getdata(link_api,id,{"remember_token":worker_token});
        // console.log({...returnedData}.contracts);
        setContracts({...returnedData}.contracts);
    }
    const deleteContract = async(id)=>{
        let call_api = (role!=='c')?new Worker():new Customer();
        let link_api = (role!=='c')?"http://127.0.0.1:8000/api/sanai3i/worker/deleteContracts":"http://127.0.0.1:8000/api/sanai3i/customer/deleteContracts";
        let amin_token = sessionStorage.getItem('token');
        let returnedData = await call_api.Deletdata(link_api,id,{"remember_token":amin_token});
        if((returnedData.message==="تم حذف العقد بنجاح"&&(role==='c'))||returnedData.message==="تم رفض العقد بنجاح"){;
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: <strong>{returnedData.message}</strong>,
                html: <i>اضغط على الزر</i>,
                icon: 'success',
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(function() {
                getcontracts();
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
    const handleacceptcustomer = async(id)=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/acceptContract`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData =await call_api.Postdata(link_api,{contract_id:id},{"remember_token":worker_token});
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: <strong>{returnedData.message}</strong>,
            html: <i>اضغط على الزر للاستكمال</i>,
            icon: (returnedData.message==="تم قبول العقد بنجاح")?"success":"error",
            confirmButtonColor: '#0753b9',
            confirmButtonText:'موافق',
        }).then(()=>{
            getcontracts();
        });
    }
    const handleRateworker = async(customer_id,worker_id,contract_id)=>{
        let call_api = new Worker();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/worker/rate`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData =await call_api.Postdata(link_api,{...datarateworker,customer_id,worker_id,contract_id},{"remember_token":worker_token});
        const MySwal = withReactContent(Swal);
        if(returnedData.success){
            MySwal.fire({
                title: <strong>{returnedData.message}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon: "success",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(()=>{
                getcontracts();
            });   
        }else{
            MySwal.fire({
                title: <strong>{returnedData.message}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon:"error",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            })
        }
    }
    useEffect(()=>{
        getcontracts();
        if(sessionStorage.getItem('currentid')===null||sessionStorage.getItem('token')===null){
            navigator('/');
        }
    },[])
    return (
        <div className='contracts-parent my-2'>
            <h4 className='text-end'>الاتفاقيات</h4>
            <div className='contracts ms-2 p-2'>
                {
                    (contracts!==undefined)?
                        ((contracts.length!==0)?contracts.map((el)=>{
                            return(
                                <div key={el.id} className='card2 w-100 border-0 text-end p-2'>
                                    {
                                        (role!=='c'&&el.Process_status==='مكتمل')&&
                                        <div className='popups-container'>
                                                <div className='popup-rate p-2'>
                                                    <p className='fs-5'>تم اكتمال العميله بنجاح </p>
                                                    <p className='fs-5 text-danger'>برجاء اكمال عمليه التقييم</p>
                                                    <div className='popup-rate-details'>
                                                        <Rating
                                                            onClick={(rate)=>{
                                                                setDataRateWorker({...datarateworker,rate:rate});
                                                            }}
                                                            allowFraction
                                                            transition
                                                        />
                                                        <span className='span-details'>العميل</span>
                                                    </div>
                                                    {(((massage!==undefined&&massage.rateing!==undefined)))&&<p className='fs-6 text-danger'>{massage.rateing}</p>}
                                                    <button className='btn btn-primary mt-2' onClick={()=>{
                                                        if(datarateworker.rate!==undefined&&datarateworker.rate!==''){
                                                            handleRateworker(el.customer_id,el.worker_id,el.id);
                                                            setMassage(undefined);
                                                        }else{
                                                            setMassage(
                                                                { rateing:'برجاء اضافه تقيم'}
                                                            );
                                                        }
                                                    }}>اضافه تقيم</button>
                                                </div>
                                        </div>
                                    }
                                    <div className='flo p-2'>
                                        {((el.Process_status === "في انتظار موافقة العميل")&&(role==='c'))?<span>{'تم تحديد السعر من العامل'}</span>:((el.Process_status==='تم الانتهاء')?<span>مكتمل</span>:<span>{el.Process_status}</span>)}
                                    </div>
                                    {(role==='c')?<h6 className='mt-3'>معلومات عن العامل*</h6>:<h6 className='mt-3'>معلومات عن العميل*</h6>}
                                    {(role!=='c')?<p className=''>الاسم العميل: <span className='tilleing'>{el.name}</span></p>:<p className=''>الاسم : <span className='tilleing'>{el.name}</span></p>}
                                    <p className=''>رقم الهاتف : <span className='tilleing'>{el.phone}</span></p>
                                    {(role==='c')&&<p className=''>القسم : <span className='tilleing'>{el.category_name}</span></p>}
                                    <p className=''>محل الاقامه : <span className='tilleing'>{el.address}</span></p>
                                    <h6 className=''>معلومات عن الاتفاقيه*</h6>
                                    <p> وصف الاتفاقيه : <span className='tilleing'>{el.description}</span></p>
                                    <p>بدايه الاتفاقيه : <span className='tilleing'>{(new Date(el.start_date)).toLocaleDateString('ar-eg',{
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}</span></p>
                                    <p>نهايه الاتفاقيه المتوقع : <span className='tilleing'>{(new Date(el.ex_end_date)).toLocaleDateString('ar-eg',{
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}</span></p>
                                    <p className=''> طريقه الدفع : <span className='tilleing'>{(el.payment_type==='كاش'?"نقدى":el.payment_type)}</span></p>
                                    <p>السعر المتفق عليه : <span className='tilleing'>{`${el.price} جنيه مصرى`}</span></p>
                                    {(el.Process_status === "جاري العمل عليه")&&<div className='actions-buttons'>
                                                {(role==='c')&&<><button className='btn btn-custom btn-primary' onClick={()=>{
                                                    setContractDetails({
                                                        user_id:el.customer_id,
                                                        worker_id:el.worker_id,
                                                        id:el.id,
                                                        status:el.status
                                                    });
                                                    setCurentpaymenttype(el.payment_type);
                                                    setOpenpayment(true);
                                                }}>انهاء الاتفاقيه</button>
                                                    <button className='btn btn-custom btn-danger' onClick={()=>{
                                                        deleteContract(el.id);
                                                    }}>الغاء الاتفاقيه</button>
                                                    <button className='btn btn-custom btn-secondary' onClick={()=>{
                                                        setContractDetails({
                                                            user_id:el.customer_id,
                                                            worker_id:el.worker_id,
                                                            id:el.id,
                                                        });
                                                        setOpenreport(true);
                                                    }}>اجراء شكوى</button></>}
                                    </div>}
                                    {(el.Process_status === "في انتظار موافقة العميل")&&<div className='actions-buttons'>
                                                {(role==='c')&&<>
                                                        <button className='btn btn-custom btn-danger' onClick={()=>{
                                                            deleteContract(el.id);
                                                        }}>رفض الاتفاقيه</button>
                                                        <button className='btn btn-custom btn-secondary' onClick={()=>{
                                                            handleacceptcustomer(el.id);
                                                        }}>قبول عرض</button>
                                                </>}
                                    </div>}
                                    {(el.Process_status === "في انتظار الموافقة والسعر")&&<div className='actions-buttons'>
                                                {(role!=='c')?<>
                                                        <button className='btn btn-custom btn-danger' onClick={()=>{
                                                            deleteContract(el.id);
                                                        }}>رفض الاتفاقيه</button>
                                                        <button className='btn btn-custom btn-secondary' onClick={()=>{
                                                            setContractDetails({
                                                                user_id:el.customer_id,
                                                                worker_id:el.worker_id,
                                                                id:el.id,
                                                            });
                                                            setOpenPrice(true);
                                                        }}>اضافه عرض</button>
                                                </>:<>
                                                    <button className='btn btn-custom btn-danger' onClick={()=>{
                                                        deleteContract(el.id);
                                                    }}>رفض الاتفاقيه</button>
                                                </>}
                                    </div>}
                                    {(el.Process_status !== "ملغي")&&<div className="w-100 row justify-content-center align-items-center mt-2">
                                            <Link className='btn btn-info' style={{width:"fit-content"}} to={`${(role==='c')?`/chatuser/${el.worker_id}`:`/chatworker/${el.customer_id}`}`}>
                                                محادثه
                                            </Link> 
                                    </div>}
                                </div>
                            )
                        }):<div className='p-2 text-center'>لا يوجد عروض</div>):<div className='empty p-2'></div>                
                }        
            </div>
            {(openreport)&&<MakeReportForm contractDetails={contractDetails} setOpenreport={setOpenreport} getcontracts={getcontracts}>
            <i className="bi bi-x-square-fill" onClick={()=>{
                setOpenreport(false);
            }}></i>
            </MakeReportForm>}
            {(openprice)&&<MakePriceForm contractDetails={contractDetails} setOpenPrice={setOpenPrice} getcontracts={getcontracts}>
            <i className="bi bi-x-square-fill" onClick={()=>{
                setOpenPrice(false);
            }}></i>
            </MakePriceForm>}
            {(openpayment)&&<Payment  paymentType={curentpaymenttype} contractDetails={contractDetails} setOpenpayment={setOpenpayment} getcontracts={getcontracts} >
            <i className="bi bi-x-square-fill" onClick={()=>{
                setOpenpayment(false);
            }}></i>
            </Payment>}
        </div>
    )
}

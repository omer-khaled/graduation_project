import React, { useEffect, useState } from "react";
import Admin from "../../logic/admin";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
function Reports(){
    let [sanai3i,setSanai3i] = useState(undefined);
    const [showCnotract,setShowContract] = useState(false);
    const [currentContract,setCurrentContract] = useState(undefined);
    useEffect(()=>{
        getdata();
    },[]);
    const getdata = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/reports";
        let amin_token = sessionStorage.getItem('adminToken');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":amin_token});
        let users = [...(returnedData.reports)];
        // console.log(returnedData.reports);
        setSanai3i([...users]);
    }
    return(
        <>
            <div className='cont'>
                <h1>Reports</h1>
                <div className='users'>
                    <h2>Reports</h2>
                    <div className="table-responsive">
                    {(sanai3i!==undefined)?((sanai3i.length!==0)?<table dir="rtl" width={"100%"}>
                            <thead width={"100%"}>
                                <tr>
                                    <th width={"((100%-450px)/3)"}>الاسم العميل</th>
                                    <th width={"((100%-450px)/3)"}>الاسم العامل</th>
                                    <th width={"((100%-450px)/3)"}>التعليق</th>
                                    <th width={"450px"}>التحكم</th>
                                </tr>
                            </thead>
                            <tbody width={"100%"}>
                                {
                                    (sanai3i.map((el,index)=>{
                                        return(
                                            <tr key={el.id}>
                                                <td width={"((100%-450px)/3)"}>{el.customer_name}</td>
                                                <td width={"((100%-450px)/3)"}>{el.worker_name}</td>
                                                <td width={"((100%-450px)/3)"}>{el.comment}</td>
                                                <td width={"450px"}>
                                                    <div className="d-flex justify-content-around align-items-center">
                                                        <button className='b-green' onClick={async(e)=>{
                                                            let call_api = new Admin();
                                                            let link_api = (el.worker_status==="active")?"http://127.0.0.1:8000/api/sanai3i/admin/allusers/suspendworker":"http://127.0.0.1:8000/api/sanai3i/admin/allusers/verifyworker";
                                                            let admin_token = sessionStorage.getItem('adminToken');
                                                            let returnedData =await call_api.PutdataStatus(link_api,el.worker_id,{"remember_token":admin_token});
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
                                                        }}>{(el.worker_status==="active")?"تجميد العامل":"تفعيل العامل"}</button>
                                                        <button className='b-green' onClick={async(e)=>{
                                                            let call_api = new Admin();
                                                            let link_api = (el.customer_status==="active")?"http://127.0.0.1:8000/api/sanai3i/admin/allusers/suspendcustomer":"http://127.0.0.1:8000/api/sanai3i/admin/allusers/activate";
                                                            let admin_token = sessionStorage.getItem('adminToken');
                                                            let returnedData =await call_api.PutdataStatus(link_api,el.customer_id,{"remember_token":admin_token});
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
                                                        }}>{(el.customer_status==="active")?"تجميد العميل":"تفعيل العميل"}</button>
                                                        <button className='b-blue' onClick={async(e)=>{
                                                            let call_api = new Admin();
                                                            let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/contract";
                                                            let admin_token = sessionStorage.getItem('adminToken');
                                                            // console.log(el.contract_id);
                                                            let returnedData =await call_api.getSingleContract(link_api,{"remember_token":admin_token},el.contract_id);
                                                            // console.log(returnedData);
                                                            setShowContract(true);
                                                            setCurrentContract({...returnedData}.data.contract);
                                                        }}>الاتفاقيه</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }))
                                }
                            </tbody>
                        </table>:<div className="text-center">لا يوجد شكاوى</div>):<div className='d-flex justify-content-center align-items-center p-3'><div className='empty'></div></div>}
                    </div>
                </div>
            </div>
            { 
                (showCnotract&&currentContract!==undefined)&&<div className="cutsom-contracts">
                    <div className='contracts ms-2 p-4'>
                        <i className="bi bi-x-square-fill" onClick={()=>{
                            setShowContract(false);
                        }}></i>
                        <div className='card2 w-100 border-0 text-end p-2'>
                            <div className='flo p-2'>
                                <span>{currentContract.Process_status}</span>
                            </div>
                            <h6 className='mt-5'>معلومات عن العميل*</h6>
                            <p className=''>الاسم : <span className='tilleing'>{currentContract.customer_name}</span></p>
                            <p className=''>رقم الهاتف : <span className='tilleing'>{currentContract.customer_phone}</span></p>
                            <p className=''>محل الاقامه : <span className='tilleing'>{currentContract.customer_address}</span></p>
                            <h6 className='mt-3'>معلومات عن العامل*</h6>
                            <p className=''>اسم: <span className='tilleing'>{currentContract.worker_name}</span></p>
                            <p className=''>رقم الهاتف : <span className='tilleing'>{currentContract.worker_phone}</span></p>
                            <p className=''>القسم : <span className='tilleing'>{currentContract.category_name}</span></p>
                            <p className=''>محل الاقامه : <span className='tilleing'>{currentContract.worker_address}</span></p>
                            <h6 className=''>معلومات عن الاتفاقيه*</h6>
                            <p> وصف الاتفاقيه : <span className='tilleing'>{currentContract.description}</span></p>
                            <p>بدايه الاتفاقيه : <span className='tilleing'>{(new Date(currentContract.start_date)).toLocaleDateString('ar-eg',{
                                weekday: 'long',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}</span></p>
                            <p>نهايه الاتفاقيه المتوقع : <span className='tilleing'>{(new Date(currentContract.ex_end_date)).toLocaleDateString('ar-eg',{
                                weekday: 'long',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}</span></p>
                            <p>السعر المتفق عليه : <span className='tilleing'>{`${currentContract.price} جنيه مصرى`}</span></p>
                            <p>طريقه الدفع : <span className='tilleing'>{`${currentContract.payment_type}`}</span></p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
export default Reports;
// <th >موعد بدء الاتفاقيه</th>
// <th >موعد انتهاء الاتفاقيه</th>
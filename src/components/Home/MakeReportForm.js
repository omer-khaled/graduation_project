import React, { useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Customer from '../../logic/customer';
function MakeReportForm({contractDetails,children,getcontracts,setOpenreport}) {
    let [data,setData] = useState(  
    {
        customer_id:contractDetails.user_id,
        worker_id:contractDetails.worker_id,
        contract_id:contractDetails.id,
    });
    const submitHandel = async()=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/report`;
        let worker_token = sessionStorage.getItem('token');
        let obj = {...data};
        let returnedData =await call_api.Postdata(link_api,obj,{"remember_token":worker_token});
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: <strong>{returnedData.message}</strong>,
            html: <i>اضغط على الزر للاستكمال</i>,
            icon: (returnedData.message==="تم تسجيل البلاغ بنجاح")?"success":"error",
            confirmButtonColor: '#0753b9',
            confirmButtonText:'موافق',
        }).then(()=>{
            getcontracts();
            setOpenreport(false);
        });
    }
    return (
        <div className='edit-container'>
            <div className='edit'>
                <form className='signup-form' onSubmit={(e)=>{
                    e.preventDefault();
                    submitHandel();
                }}>
                    <h3 className='fs-5'>عمل شكوى</h3>
                    {children}
                    <div className='control-anim'>
                        <textarea className='form-control mb-3' required dir='rtl' type={'text'}  onChange={(e)=>{
                            setData({...data,comment:e.target.value})
                        }}/>
                        <span>الرساله</span>
                    </div>
                    <button type="submit" className={`btn w-100} btn-primary btn-brand`}>ارسال</button>
                </form>
            </div>
        </div>
    )
}
export default MakeReportForm;

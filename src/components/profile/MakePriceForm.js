import React, { useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Customer from '../../logic/customer';
function MakePriceForm({contractDetails,children,getcontracts,setOpenPrice}) {
    let [data,setData] = useState(  
    {
        customer_id:contractDetails.user_id,
        worker_id:contractDetails.worker_id,
        contract_id:contractDetails.id,
    });
    const submitHandel = async()=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/worker/acceptContract`;
        let worker_token = sessionStorage.getItem('token');
        let obj = {...data};
        let returnedData =await call_api.Postdata(link_api,obj,{"remember_token":worker_token});
        const MySwal = withReactContent(Swal);
        if(returnedData.message==="تم قبول العقد بنجاح"){
            MySwal.fire({
                title: <strong>{returnedData.message}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon: "success",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(()=>{
                getcontracts();
                setOpenPrice(false);
            });
        }else{
            MySwal.fire({
                title: <strong>{returnedData.message}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon: "error",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(()=>{
            });
        }
    }
    return (
        <div className='edit-container'>
            <div className='edit'>
                <form className='signup-form' onSubmit={(e)=>{
                    e.preventDefault();
                    submitHandel();
                }}>
                    <h3 className='fs-5'>اضافه سعر</h3>
                    {children}
                    <div className='control-anim'>
                        <input className='form-control mb-3' required dir='rtl' type={'number'}  onChange={(e)=>{
                            setData({...data,price:e.target.value})
                        }}/>
                        <span>السعر المتوقع</span>
                    </div>
                    <button type="submit" className={`btn w-100} btn-primary btn-brand`}>اضافه</button>
                </form>
            </div>
        </div>
    )
}
export default MakePriceForm;


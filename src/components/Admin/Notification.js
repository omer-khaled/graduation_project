import React, { useRef, useState } from 'react'
import Admin from '../../logic/admin';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
export default function Notification() {
    let [data,setData] = useState(undefined);
    const messageref = useRef();
    const submitHandle = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/notify";
        let admin_token = sessionStorage.getItem('adminToken');
        let obj = {...data};
        const formData = new FormData();
        formData.append('message', obj.message);
        let returnedData =await call_api.dealdataCategory(link_api,formData,{"remember_token":admin_token});
        const MySwal = withReactContent(Swal);
        if(returnedData.data.success){
            MySwal.fire({
                title: <strong>{returnedData.data.message}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon: "success",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(function() {
                (messageref.current).value = "";
            });
        }else{
            MySwal.fire({
                title: <strong>{"حدث مشكله اثناء الارسال"}</strong>,
                html: <i>اضغط على الزر للاستكمال</i>,
                icon: "error",
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(function() {
                (messageref.current).value = "";
            });
        }
    }
    return (
        <div className='cont-cutom'>
            <div className='coverform'>
                <form className='signup-form custom-form' onSubmit={(e)=>{
                    e.preventDefault();
                    submitHandle();
                }}>
                    <h3 className='fs-5'>اضافه رساله</h3>
                    <div className='control-anim'>
                        <textarea ref={messageref} required dir='rtl' className='form-control mb-1' type={'text'} onChange={(e)=>{
                            setData({...data,message:e.target.value});
                        }}/>
                        <span>الوصف</span>
                    </div>
                    <button type="submit" className={`btn w-100 btn-brand btn-primary`}>اضافه</button>
                </form>
            </div>
        </div>
        
    )
}

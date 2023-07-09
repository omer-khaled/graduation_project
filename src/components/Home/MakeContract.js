import React, { useState } from 'react'
import Customer from '../../logic/customer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export default function MakeContract({children,contractdetails,setMakeContract}) {
        let [data,setData] = useState({
            customer_id:contractdetails.customer_id,
            worker_id:contractdetails.worker_id,
            payment_type:'فيزا',
        });
        let [massage,setMassage] = useState(undefined);
        const validationHandle = ()=>{
            let returnvalue = true;
            let validating = {};
            let feilds = [
                "description",
                'start_date',
                'ex_end_date',
            ]
            let feildsarabic = [
                "الوصف",
                'بدايه المشروع',
                'نهايه المشروع',
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
        const submitHandel = async()=>{
            let validate = false;
            if(data!==undefined){
                validate = validationHandle();
            }
            if(validate&&data!==undefined){
                let call_api = new Customer();
                let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/addContracts`;
                let worker_token = sessionStorage.getItem('token');
                let obj = {...data};
                let returnedData =await call_api.Postdata(link_api,obj,{"remember_token":worker_token});
                const MySwal = withReactContent(Swal);
                if(returnedData.message==="تم اضافة العقد بنجاح"){
                    MySwal.fire({
                        title: <strong>{returnedData.message}</strong>,
                        html: <i>اضغط على الزر للاستكمال</i>,
                        icon: "success",
                        confirmButtonColor: '#0753b9',
                        confirmButtonText:'موافق',
                    }).then(()=>{
                        setMakeContract(false);
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
        }
        return (
            <div className='edit-container'>
                <div className='edit'>
                    <form className='signup-form' onSubmit={(e)=>{
                        e.preventDefault();
                        submitHandel();
                    }}>
                        <h3 className='fs-5'>اعمل اتفاقيه</h3>
                        {children}
                        <div className='control-anim'>
                            <textarea className='form-control mb-3' dir='rtl' type={'text'}  onChange={(e)=>{
                                setData({...data,description:e.target.value})
                            }}/>
                            <span>وصف الاتفاقيه</span>
                        </div>
                        {(((massage!==undefined&&massage.description!==undefined)))&&<p className='fs-6 text-danger'>{massage.description}</p>}
                        <div className='control-anim'>
                            <input className='form-control mb-3'  dir='rtl' type={'date'}  onChange={(e)=>{
                                setData({...data,start_date:e.target.value})
                            }}/>
                            <span>بدايه الاتفاقيه</span>
                        </div>
                        {(((massage!==undefined&&massage.start_date!==undefined)))&&<p className='fs-6 text-danger'>{massage.start_date}</p>}
                        <div className='control-anim'>
                            <input className='form-control mb-3'  dir='rtl' type={'date'}  onChange={(e)=>{
                                setData({...data,ex_end_date:e.target.value})
                            }}/>
                            <span>نهايه الاتفاقيه المتوقع</span>
                        </div>
                        {(((massage!==undefined&&massage.ex_end_date!==undefined)))&&<p className='fs-6 text-danger'>{massage.ex_end_date}</p>}
                        <div className='w-100 d-flex justify-content-between my-2'>
                            <div>
                                <label htmlFor="فيزا">فيزا</label>
                                <input className='ms-1 radio'  checked={data.payment_type==='فيزا'&&true} type={"radio"} id="فيزا" value="فيزا" name="payment_type" onChange={(e)=>{
                                    setData({...data,payment_type:e.target.value});
                                }}/>
                            </div>
                            <div>
                                <label htmlFor="كاش">نقدى</label>
                                <input  className='ms-1 radio'  checked={data.payment_type==='كاش'&&true} type={"radio"} id="كاش" value="كاش" name="payment_type" onChange={(e)=>{
                                    setData({...data,payment_type:e.target.value});
                                }}/>
                            </div>
                        </div>
                        <button type="submit" className={`btn w-100} btn-primary btn-brand`}>ارسال</button>
                    </form>
                </div>
            </div>
        )
}

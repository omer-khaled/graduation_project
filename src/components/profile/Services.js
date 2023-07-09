import React, {useState } from 'react'
import Worker from '../../logic/worker';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { profileStore } from '../ProfileWorker';
import { useContext } from 'react';
function Services({type,children,id,profileData}) {
    let [file,setFile] = useState(undefined); 
    let [data,setData] = useState({});
    let {servicesEdit,setServicesEdit} = useContext(profileStore);
    const [massage,setMassage] = useState(undefined);
    const validationHandle = ()=>{
        let returnvalue = true;
        let validating = {};
        let feilds = [
            'work_image'
        ]
        const imagetyps = ['image/png','image/jpeg','image/jpg'];
        feilds.forEach((el,index)=>{
            if(el==='work_image'&&!imagetyps.includes((data[el]).type)){
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
        if(validate&&data!==undefined){
            let call_api = new Worker();
            let link_api = `http://127.0.0.1:8000/api/sanai3i/worker/storePortfolio`;
            let worker_token = sessionStorage.getItem('token');
            let obj = {...data};
            const formData = new FormData();
            formData.append('worker_id', id);
            formData.append('work_image', obj.work_image);
            let returnedData =await call_api.ServicePostdata(link_api,formData,{"remember_token":worker_token});
            const MySwal = withReactContent(Swal);
            if(returnedData.data.message==='تم اضافة الصورة بنجاح'){
                setServicesEdit(!servicesEdit);
                MySwal.fire({
                    title: <strong>{"تم اضافه الصوره بنجاح"}</strong>,
                    html: <i>اضغط على الزر للاستكمال</i>,
                    icon: "success",
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                });
            }else{
                MySwal.fire({
                    title: <strong>{"حدث خطاء اثناء الرفع"}</strong>,
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
                    <h3 className='fs-5'>اضافه خدمه جديده</h3>
                    {children}
                    <div className='avatar-edit'>
                        <div className='icon'>
                            {(file!==undefined)&&<img src={file} alt="personal" />}
                            <input type={"file"} onChange={(e)=>{
                                let src = e.target.files[0];
                                setFile(URL.createObjectURL(src));
                                setData({...data,work_image:(e.target.files[0])})
                            }}/>
                            <i className="bi bi-camera-fill"></i>
                        </div>
                    </div>
                    {(((massage!==undefined&&massage.work_image!==undefined)))&&<p className='fs-6 text-danger'>{massage.work_image}</p>}
                    <button type="submit" className={`btn w-100 ${(type===true)&&'mt-3'} btn-primary btn-brand`}>اضافه</button>
                </form>
            </div>
        </div>
    )
}
export default Services;

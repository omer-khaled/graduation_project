import React, { useContext, useEffect, useState } from 'react'
import personalImage from '../../Assets/images/user.jpg';
import Edit from './Edit';
import Malaf from './Malaf';
import { profileStore } from '../ProfileWorker';
import Services from './Services';
import MakeContract from '../Home/MakeContract';
import UpdatePassword from './UpdatePassword';
function Personal({type,profileData,id,role,owner,worker}) {
    let {profileEdit,setProfileEdit} = useContext(profileStore);
    let {servicesEdit,setServicesEdit} = useContext(profileStore);
    let [makecontract,setMakeContract] = useState(false);
    let [showUpdatePassword,setShowUpdatePassword] = useState(false);
    let [contractdetails,setContractDetails] = useState({});
    let [stars,setStars] = useState();
    const makeRate = ()=>{
            // const roundRate = (role!=='c')?profileData.rate:Math.round(profileData.rate);
            const roundRate = profileData.rate;
            let frk = (roundRate) - parseInt(roundRate);
            let arrcur = (new Array(parseInt(roundRate)).fill(1));
            if(frk<0.5){
                arrcur.push(0);
            }else if(frk>=0.5){
                arrcur.push(5);
            }
            if(frk===0){
                for(let i = 0;i<(5-parseInt(roundRate));i++){
                    arrcur.push(0);
                }
            }else{
                for(let i = 0;i<(4-parseInt(roundRate));i++){
                    arrcur.push(0);
                }
            }
            setStars(arrcur);
    }
    useEffect(()=>{
        (profileData.rate!==undefined)&&makeRate();
    },[])
    return (
            <React.Fragment>
                <div className='personal-info'>
                    <div className='container'>
                    {
                        (profileData.rate===undefined||profileData.rate===0)?<div className='rate'>
                            <i className="bi bi-star-fill ms-1 star"></i>
                            <i className="bi bi-star-fill ms-1 star"></i>
                            <i className="bi bi-star-fill ms-1 star"></i>
                            <i className="bi bi-star-half ms-1 star"></i>
                            <i className="bi bi-star ms-1 star"></i>
                        </div>:<div className='rate'>{(stars!==undefined)&&stars.map((el,index)=>{
                            return (el!==0)?<i key={index} className={(el===1)?"bi bi-star-fill ms-1 star":"bi bi-star-half ms-1 star"}></i>:<i  key={index} className="bi bi-star ms-1 star"></i>;
                        })}</div>
                        }
                        <div className='main-details'>
                            <img src={(profileData.image!==undefined)?`data:image/png;base64, ${profileData.image}`:personalImage} alt="personalImage" />
                            <p className='fs-3 seconde mt-1 mb-1'>{profileData.name}</p>
                            <div className='details mt-1' dir='rtl'>
                                {(role!=='c')&&<div className='sub-info ms-2'>
                                    <i className="bi bi-tag-fill fs-6 seconde ms-1"></i>
                                    <span className='fs-5 seconde'>{profileData.Category.name}</span>
                                </div>}
                                <div className='sub-info ms-2'>
                                    <i className="bi bi-geo-alt-fill fs-6 seconde ms-1"></i>
                                    <span className='fs-5 seconde'>{profileData.Region.city_name}</span>
                                </div>
                                {(role!=='c')&&<div className='sub-info ms-2'>
                                    <i className="bi bi-tag-fill fs-6 seconde ms-1"></i>
                                    <span className='fs-5 seconde'>{profileData.initial_price}</span>
                                </div>}
                            </div>
                        </div>
                        <div className={`updates mt-3 ${'justify-content-between'}`}>
                            <div className='d-flex justify-content-center'>
                                {(owner!=='w'&&(profileData.id===(Number(sessionStorage.getItem('currentid')))))&&<button className='btn btn-success success mb-2 me-2' onClick={(e)=>{
                                    setProfileEdit(true);
                                }}>تعديل الملف الشخصى</button>}
                                {(owner!=='w'&&(profileData.id===(Number(sessionStorage.getItem('currentid')))))&&<button className='btn btn-success success mb-2 me-2' onClick={(e)=>{
                                    setShowUpdatePassword(true);
                                }}>تعديل كلمه السر</button>}
                                {(owner==='w')&&<button className='custom-Link btn btn-success success mb-2' onClick={()=>{
                                    setContractDetails({
                                        customer_id:Number(sessionStorage.getItem('currentid')),
                                        worker_id:profileData.id
                                    });
                                    setMakeContract(true);
                                }}>عمل اتفاقيه</button>}
                            </div>
                            <div className='tabs'>
                                <div className={`sub-info ms-2 p-2 checked`} >
                                    <span className='fs-5 success'>الملف الشخصى</span>
                                    <i className="bi bi-person-fill fs-6 success ms-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {<Malaf type={type} owner={owner} worker={worker} role={role} profileData={profileData} id={id} />}
                {(profileEdit)&&<Edit role={role}  type={type} profileData={profileData} id={id}>
                    <i className="bi bi-x-square-fill" onClick={()=>{
                        setProfileEdit(false);
                    }}></i>
                </Edit>}
                {((servicesEdit)&&<Services  type={type}  profileData={profileData}  id={id}>
                    <i className="bi bi-x-square-fill" onClick={()=>{
                        setServicesEdit(false);
                    }}></i>
                </Services>)}
                {(makecontract)&&<MakeContract contractdetails={contractdetails} setMakeContract={setMakeContract} >
                <i className="bi bi-x-square-fill" onClick={()=>{
                    setMakeContract(false);
                }}></i>
                </MakeContract>}
                {(showUpdatePassword)&&<UpdatePassword role={role} profileDataID={profileData.id} setShowUpdatePassword={setShowUpdatePassword} >
                    <i className="bi bi-x-square-fill" onClick={()=>{
                        setShowUpdatePassword(false);
                    }}></i>
                </UpdatePassword>}
            </React.Fragment>
    )
}
export default Personal;
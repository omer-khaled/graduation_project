import React, { createContext, useEffect, useState } from 'react'
import Personal from './profile/Personal';
import { useNavigate, useParams } from 'react-router-dom';
import Worker from '../logic/worker';
import FakePersonal from './profile/FakePersonal';
export let profileStore = createContext();
function Profile({owner}) {
    let [profileState,setProfilestate] = useState(false);
    let [profileEdit,setProfileEdit] = useState(false);
    let [servicesEdit,setServicesEdit] = useState(false);
    // let [forcestate,setForcetate] = useState(false);
    let {id} = useParams();
    let type = 'w';
    let [user,setUser] = useState(undefined);
    let currentid = sessionStorage.getItem('currentid');
    let naviagetor = useNavigate();
    let getData = async()=>{
        let call_api = new Worker();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/worker/worker-profile";
        let workerToken = sessionStorage.getItem('token');
        let returnedData = await call_api.getdata(link_api,id,{"remember_token":workerToken});
        if({...returnedData}.message === 'worker not found'){
            naviagetor(-1);
        }
        setUser({...returnedData});
    }
    useEffect(()=>{
        getData();
    },[profileState,profileEdit,servicesEdit]);
    if(currentid!==id){
        type='u';
    }
    return (
        <profileStore.Provider value={{profileState,setProfilestate,profileEdit,setProfileEdit,servicesEdit,setServicesEdit}}>
            <div className='profile'>
                    {
                        (user!==undefined)?<Personal owner={owner} worker={true} type={type} id={id} profileData={{...user}}/>:<FakePersonal type={type} />
                    }
            </div>
        </profileStore.Provider>
    )
}
export default Profile;

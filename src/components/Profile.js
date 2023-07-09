import React, { createContext, useEffect, useState } from 'react'
import Personal from './profile/Personal';
import { useNavigate, useParams } from 'react-router-dom';
import Worker from '../logic/worker';
import FakePersonal from './profile/FakePersonal';
// export let profileStore = createContext();
import { profileStore } from './ProfileWorker';
import Customer from '../logic/customer';
function Profile() {
    let [profileState,setProfilestate] = useState(false);
    let [profileEdit,setProfileEdit] = useState(false);
    let [servicesEdit,setServicesEdit] = useState(false);
    let {id} = useParams();
    let type = 'w';
    let [user,setUser] = useState(undefined);
    let currentid = sessionStorage.getItem('currentid');
    let naviagetor = useNavigate();
    let role = 'c';
    let getData = async()=>{
        let call_api = new Customer();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/customer/profile";
        let workerToken = sessionStorage.getItem('token');
        let returnedData = await call_api.getdata(link_api,id,{"remember_token":workerToken});
        if({...returnedData}.message === 'worker not found'){
            naviagetor(-1);
        }
        setUser({...returnedData}.customer);
    }
    useEffect(()=>{
        getData();
    },[profileState,profileEdit]);
    if(currentid!==id){
        type='u';
    }
    return (
        <profileStore.Provider value={{profileState,setProfilestate,profileEdit,setProfileEdit}}>
            <div className='profile'>
                    {
                        (user!==undefined)?<Personal role={role} type={type} worker={false} id={id} profileData={{...user}}/>:<FakePersonal type={type} role={role} />
                    }
            </div>
        </profileStore.Provider>
    )
}
export default Profile;

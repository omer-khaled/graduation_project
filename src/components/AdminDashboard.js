import { Outlet, useNavigate } from "react-router-dom";
import Sidbar from "./Admin/Sidbar";
import { useEffect } from "react";

function AdminDashboard(){
    let navigator = useNavigate();
    useEffect(()=>{
        let token = sessionStorage.getItem('adminToken');
        if(token===null){
            navigator('/adminlogin');
        }
    },[])
    return(
        <div className="dashboard">
            <Sidbar />
            <div className='containere'>
                <Outlet />
            </div>
        </div>
    );
}
export default AdminDashboard;
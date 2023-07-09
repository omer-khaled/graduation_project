import React from 'react'
import logo from '../../Assets/images/Artboard 85 copy 3.png';
import personalImage from '../../Assets/images/user.jpg';
import { Link, useNavigate } from 'react-router-dom';
import Worker from '../../logic/worker';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
export default function WorkerNavbar() {
    const navigator = useNavigate();
    const handlelogout = async()=>{
        const call_api = new Worker();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/worker/logout";
        const worker_token = sessionStorage.getItem('token');
        const returnedData =await call_api.Logout(link_api,{"remember_token":worker_token});
        if(returnedData.message==='تم تسجيل الخروج بنجاح'){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('currentid');
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: <strong>{returnedData.message}</strong>,
                html: <i>اضغط على الزر</i>,
                icon: 'success',
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(function() {
                navigator(`/`);
            });
        }else{
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: <strong>{"{حدث مشكله اثناء تسجيل الخرو "}</strong>,
                html: <i>اضغط على الزر</i>,
                icon: 'error',
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            })
        }
    }
    return (
        <nav className="w-100 navbar navbar-expand-lg navbar-light" style={{backgroundColor:"var(--#ffdd0e)"}}>
            <div className="container-fluid">
                <i id='logou' className="bi bi-door-closed-fill fs-3" style={{cursor:'pointer'}} onClick={(e)=>{
                    handlelogout();
                }}></i>
                <Link className="navbar-brand" to="/">
                    <img src={logo} className='logo-image' alt="sani3i-logo"/>
                </Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item ms-4">                        
                            <Link to="/contractWork" style={{fontWeight:"700",letterSpacing:"1px"}} className="nav-link active" aria-current="page" >طلبات العمل</Link>
                        </li>
                        <Link className="personal-image ms-4" to={`Worker/${sessionStorage.getItem('currentid')}`}>
                            <img src={personalImage} className='logo-image' alt="sani3i-logo"/>
                        </Link>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '../../Assets/images/Artboard 85 copy 3.png';
import personalImage from '../../Assets/images/user.jpg';
import WorkerNavbar from '../Home/WorkerNavbar';
export default function ContractfoWorking() {
    return (
        <>
            <WorkerNavbar />
            <Outlet />
        </>
    )
}

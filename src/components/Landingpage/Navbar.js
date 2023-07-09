import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../Assets/images/Artboard 85 copy 3.png';
function Navbar() {
    return (
        <nav className="w-100 navbar navbar-expand-lg navbar-light" style={{backgroundColor:"var(--#ffdd0e)"}}>
            <div className="container-fluid">
                <a className="navbar-brand" href="./">
                    <img src={logo} className='logo-image' alt="sani3i-logo"/>
                </a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item ms-4">                        
                            <Link to="/" style={{fontWeight:"700",letterSpacing:"1px"}} className="nav-link active" aria-current="page" >الرئيسيه</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{fontWeight:"700",letterSpacing:"1px"}} className="nav-link" to="/info">معلومات عنا</Link>
                        </li>
                        <li className="nav-item ms-4">
                            <Link style={{fontWeight:"700",letterSpacing:"1px"}} className="nav-link" to="/contactus">تواصل معنا</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;

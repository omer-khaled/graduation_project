import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Admin from '../../logic/admin';
import { useEffect } from 'react';
function Sidebarlist(){
    let [isactive,Setactive] = useState('dashboard');
    let [openDrop,setopenDrop] = useState(false);
    const navigator = useNavigate();
    const location = useLocation();
    let charts = ['barchart','hbarchart','Abarchart','customerchart'];
    useEffect(()=>{
        if(((location.pathname).split('/')).length===2){
            Setactive('workers');
            navigator('workers')
        }else{
            Setactive((location.pathname).split('/')[2]);
        }
    },[])
    return(
        <React.Fragment>
            <ul className='listside'>
                <Link className='link' to={'workers'} onClick={()=>{
                    Setactive('workers');
                }}>
                    <li className={`${isactive==='workers'&&'active'}`}>workers</li>
                </Link>
                <Link className='link' to={'customers'} onClick={()=>{
                    Setactive('customers');
                }}>
                    <li className={`${isactive==='customers'&&'active'}`}>customers</li>
                </Link>
                <Link className='link' to={'reports'} onClick={()=>{
                    Setactive('reports');
                }}>
                    <li className={`${isactive==='reports'&&'active'}`}>complains</li>
                </Link>
                <Link className='link' to={'notification'} onClick={()=>{
                    Setactive('notification');
                }}>
                    <li className={`${isactive==='notification'&&'active'}`}>notification</li>
                </Link>
                <Link className='link' to={'showworkerrequests'} onClick={()=>{
                    Setactive('showworkerrequests');
                }}>
                    <li className={`${isactive==='showworkerrequests'&&'active'}`}>Showworker Requests</li>
                </Link>
                <Link className='link' to={'categories'} onClick={()=>{
                    Setactive('categories');
                }}>
                    <li className={`${isactive==='categories'&&'active'}`}>categories</li>
                </Link>
                <Link className='link' to={'regions'} onClick={()=>{
                    Setactive('regions');
                }}>
                    <li className={`${isactive==='regions'&&'active'}`}>regions</li>
                </Link>
                <div className="dropdown">
                    <div className="w-100 position-relative">
                        <button className={`${(charts.includes(isactive))&&'active'}btn btn-secondary btn-link dropdown-toggle w-100 b-0`} type="button" onClick={()=>{
                            setopenDrop(!openDrop);
                            Setactive('barchart');
                            navigator('barchart');
                        }} >
                            Charts
                        </button>
                    </div>
                    {(openDrop)&&<ul className="submenue">
                        <li><Link onClick={()=>{
                            Setactive('barchart');
                        }} className={`dropdown-item ${(isactive==='barchart')&&'active'}`} to={'barchart'}>workers and customers over years</Link></li>
                        <li><Link onClick={()=>{
                            Setactive('hbarchart');
                        }} className={`dropdown-item ${(isactive==='hbarchart')&&'active'}`} to={'hbarchart'}>workers in categories</Link></li>
                        <li><Link onClick={()=>{
                            Setactive('Abarchart');
                        }} className={`dropdown-item ${(isactive==='Abarchart')&&'active'}`} to={'Abarchart'}>workers in regions</Link></li>
                        <li><Link onClick={()=>{
                            Setactive('customerchart');
                        }} className={`dropdown-item ${(isactive==='customerchart')&&'active'}`} to={'customerchart'}>customer in regions</Link></li>
                        <li><Link onClick={()=>{
                            Setactive('contractchart');
                        }} className={`dropdown-item ${(isactive==='contractchart')&&'active'}`} to={'contractchart'}>contracts in regions</Link></li>
                    </ul>}
                </div>
                <div className='link logout' onClick={async()=>{
                    let token  = sessionStorage.getItem('adminToken');
                    let call_api = new Admin();
                    let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/logout";
                    let returnedData=await call_api.Postdata(link_api,{},{"remember_token":token});
                    sessionStorage.removeItem('adminToken');
                    navigator('/');
                }}>
                    <li><i className="bi bi-box-arrow-left me-2"></i>Logout</li>
                </div>
            </ul>
        </React.Fragment>
    );
}
export default Sidebarlist;

// <Link className='link' to={'barchart'} onClick={()=>{
//     Setactive('barchart');
// }}>
//     <li className={`${isactive==='barchart'&&'active'}`}>customer&worker</li>
// </Link>
// <Link className='link' to={'hbarchart'} onClick={()=>{
//     Setactive('hbarchart');
// }}>
//     <li className={`${isactive==='hbarchart'&&'active'}`}>workers in categories</li>
// </Link>
// <Link className='link' to={'Abarchart'} onClick={()=>{
//     Setactive('Abarchart');
// }}>
//     <li className={`${isactive==='Abarchart'&&'active'}`}>Workers in Region</li>
// </Link>
// <Link className='link' to={'customerchart'} onClick={()=>{
//     Setactive('customerchart');
// }}>
//     <li className={`${isactive==='customerchart'&&'active'}`}>customer in Region</li>
// </Link>
import React, { useEffect, useState } from "react";
import Admin from "../../logic/admin";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import personalImage from '../../Assets/images/user.jpg';
function Users(){
    let [sanai3i,setSanai3i] = useState(undefined);
    useEffect(()=>{
        getdata();
    },[]);
    const getdata = async()=>{
        let call_api = new Admin();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/allusers";
        let amin_token = sessionStorage.getItem('adminToken');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":amin_token});
        let users = [...(returnedData.Workers)];
        setSanai3i([...users]);
    }
    return(
        <div className='cont'>
            <h1>Workers</h1>
            <div className='users'>
                <h2>Workers</h2>
                <div className="table-responsive">
                {(sanai3i!==undefined)?((sanai3i.length!==0)?<table dir="rtl" width={"100%"}>
                        <thead width={"100%"}>
                            <tr>
                                <th width={"((100%-70px)/6)"}>الاسم</th>
                                <th width={"((100%-70px)/6)"}>العنوان</th>
                                <th width={"((100%-70px)/6)"}>تاريخ الانضمام</th>
                                <th width={"((100%-70px)/6)"}>رقم الهاتف</th>
                                <th width={"((100%-70px)/6)"}>التحكم</th>
                            </tr>
                        </thead>
                        <tbody width={"100%"}>
                            {
                                (sanai3i.map((el,index)=>{
                                    let date = new Date(el.created_at);
                                    return(
                                        <tr key={el.id}>
                                            <td width={"(100/7)%"}>{el.name}</td>
                                            <td width={"(100/7)%"}>{el.address}</td>
                                            <td width={"(100/7)%"}>{`${(date).getDate()}-${(date).getMonth()+1}-${(date).getFullYear()}`}</td>
                                            <td width={"(100/7)%"}>
                                                <p>{el.phone}</p>
                                            </td>
                                            <td width={"(100/7)%"}>
                                                <div className="d-flex justify-content-around align-items-center">
                                                    <button className='b-green' onClick={async(e)=>{
                                                        let call_api = new Admin();
                                                        let link_api = (el.status==="active")?"http://127.0.0.1:8000/api/sanai3i/admin/allusers/suspendworker":"http://127.0.0.1:8000/api/sanai3i/admin/allusers/verifyworker";
                                                        let admin_token = sessionStorage.getItem('adminToken');
                                                        let returnedData =await call_api.PutdataStatus(link_api,el.id,{"remember_token":admin_token});
                                                        const MySwal = withReactContent(Swal)
                                                        MySwal.fire({
                                                            title: <strong>{returnedData.message}</strong>,
                                                            html: <i>اضغط على الزر للاستكمال</i>,
                                                            icon: 'success',
                                                            confirmButtonColor: '#0753b9',
                                                            confirmButtonText:'موافق',
                                                        }).then(function() {
                                                            getdata();
                                                        });
                                                    }}>{(el.status==="active")?"تجميد":"تفعيل"}</button>
                                                    <button className='b-red' onClick={async(e)=>{
                                                        let call_api = new Admin();
                                                        let link_api = "http://127.0.0.1:8000/api/sanai3i/admin/allusers/deleteworker";
                                                        let admin_token = sessionStorage.getItem('adminToken');
                                                        let returnedData =await call_api.Deletdata(link_api,el.id,{"remember_token":admin_token});
                                                        const MySwal = withReactContent(Swal)
                                                        MySwal.fire({
                                                            title: <strong>{returnedData.message}</strong>,
                                                            html: <i>اضغط على الزر للاستكمال</i>,
                                                            icon: 'success',
                                                            confirmButtonColor: '#0753b9',
                                                            confirmButtonText:'موافق',
                                                        }).then(function() {
                                                            getdata();
                                                        });
                                                    }}>حذف</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }))
                            }
                        </tbody>
                    </table>:<div className="text-center">لا يوجد عمال</div>):<div className='d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>}
                </div>
            </div>
        </div>
    );
}
export default Users;
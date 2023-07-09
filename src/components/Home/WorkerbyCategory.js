import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Customer from '../../logic/customer';
import Worker from '../../logic/worker';
import personalImage from '../../Assets/images/user.jpg'
export default function WorkerbyCategory() {
    let {id} = useParams();
    let [categoryName,setCatgoryName] = useState(undefined);
    let [workers,setWorkers] = useState([]);
    const getWorkers = async()=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/category/${id}`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":worker_token});
        setWorkers([...(returnedData.workers)]);
    }
    const getCategoryName = async()=>{
        let call_api = new Worker();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/admin/category/${id}`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":worker_token});
        setCatgoryName({...(returnedData.category)});
    }
    useEffect(()=>{
        getWorkers();
        getCategoryName();
    },[])
    return (
        <div className='search'>
            <div className='container'>
                <div className='sanai3ia w-100'>
                    {(categoryName!==undefined)&&<h3 content={categoryName.name}>{categoryName.name}</h3>}
                    <div className='sanai3i-cards'>
                        {
                            (workers.length!==0)?workers.map((el,index)=>{
                                return(
                                    <div className='card' key={el.id}>
                                        <img src={(el.image!==null)?`data:image/png;base64, ${el.image}`:personalImage} alt="personalImage" />
                                        <div className='card-header'>
                                                <p><i className="bi bi-person-lines-fill ms-1"></i>{el.name}</p>
                                                <p><i className="bi bi-person-workspace ms-1"></i>{el.phone}</p>
                                                <p><i className="bi bi-geo-alt-fill ms-1"></i>{el.address}</p>
                                                <button><Link className='btn custom-Link' to={`/ShowWorker/${el.id}`}>معرفه المزيد</Link></button>
                                        </div>
                                    </div>
                                )
                            }):<div className='empty'></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

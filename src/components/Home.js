import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import logo from '../Assets/images/Artboard 85 copy 3.png';
// Import Swiper styles
import Customer from '../logic/customer';
import "swiper/css";
import "swiper/css/pagination";
import personalImage from '../Assets/images/user.jpg'
import { Pagination } from "swiper";
import { Link, useNavigate } from 'react-router-dom';
function Home() {
    let [sanai3i,setSanai3i] = useState(undefined);
    let [Categories,setCategories] = useState([]); 
    const navigator = useNavigate();
    useEffect(()=>{
       // getdata();
        getCategories();
        getsanai3i();
    },[]);
    const getsanai3i = async()=>{
        let call_api = new Customer();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/customer/getBestWorkers";
        let token = sessionStorage.getItem('token');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":token});
        // console.log(returnedData);
        setSanai3i([...(returnedData.best_workers)]);
    }
    const getCategories = async()=>{
        let call_api = new Customer();
        let link_api = "http://127.0.0.1:8000/api/sanai3i/categories";
        let returnedData = await call_api.getAlldata(link_api);
        setCategories([...({...returnedData}.categories)]);
    }
    useEffect(()=>{
        if(sessionStorage.getItem('currentid')===null||sessionStorage.getItem('token')===null){
            navigator('/');
        }
    })
    return (
        <div className='home'>
            <div className='home-cover'></div>
            <div className='categories'>
                <div className='container mt-2'>
                    <h3 content="الاقسام">الاقسام</h3>
                    {(Categories.length!==0)?<Swiper
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView = {3}
                        initialSlide={5}
                        pagination={true}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {
                            Categories.map((el)=>{
                                return(
                                    <SwiperSlide key={el.id}>
                                        <div className='card'>
                                            <Link className='worker-category' to={`categories/${el.id}`}>{el.name}</Link>
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }
                    </Swiper>:<div className='empty'></div>}
                </div>
                <div className='container my-2'>
                    <div className='sanai3ia'>
                        <h3 content="ابرز الصنايعيه">ابرز الصنايعيه</h3>
                                <div className='sanai3i-cards'>
                                    {
                                        (sanai3i!==undefined)?(sanai3i.length!==0)?sanai3i.map((el)=>{
                                            return(<div className='card' key={el.id}>
                                                <img src={(el.image!==null)?`data:image/png;base64, ${el.image}`:personalImage} alt="personalImage" />
                                                <div className='card-header'>
                                                        <p><i className="bi bi-person-lines-fill ms-1"></i>{el.name}</p>
                                                        <p><i className="bi bi-person-workspace ms-1"></i>{el.phone}</p>
                                                        <p><i className="bi bi-bookmarks-fill ms-1"></i>{el.category_name}</p>
                                                        <p><i className="bi bi-geo-alt-fill ms-1"></i>{el.address}</p>
                                                        <button className='btn btn-custom'>
                                                        <Link className='custom-Link' to={`/ShowWorker/${el.id}`}>معرفه المزيد</Link></button>
                                                </div>
                                            </div>)
                                        }):<div className='w-100 text-center'>لا يوجد اى عمال</div>:<div className='empty'></div>
                                    }
                                </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
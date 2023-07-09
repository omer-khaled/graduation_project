import React, { useEffect, useState } from 'react';
import Customer from '../logic/customer';
import { Link, json } from 'react-router-dom';
import { useRef } from 'react';
import chabotImage from '../Assets/images/chatbot.jpg';
import personalImage from '../Assets/images/user.jpg';
import SearchChat from './search/SearchChat';
function Search() {
    let [Categoriesopen,setCategoriesopen] = useState(false);
    let [citiesopen,setcitiesopen] = useState(false);
    let [RateQualitopen,setRateQualitopen] = useState(false);
    let [RateTimeopen,setRateTimeopen] = useState(false);
    let [RatePricetopen,setRatePricetopen] = useState(false);
    let [categories,setCategories] = useState(undefined);
    let [regions,setRegions] = useState(undefined);
    let [sanai3i,setSanai3i] = useState(undefined);
    const [stateopen,setStateOpen] = useState(false);
    const [chatbot,setChatBot] = useState(false);
    const [chatbotsanai3i,setchatbotsanai3i] = useState(undefined);
    const [showchatbotsanai3i,setshowchatbotsanai3i]=useState(false);
    const [massage,setMessage] = useState(undefined);
    // const [returnkeys,setReturnKeys]=useState(false);
    let data = useRef({});
    const handleChatbot = async()=>{
        if(chatbot.category_id===undefined||chatbot.category_id===''){
            setMessage({category_id:'برجاء اختار القسم'});
        }else{
            let call_api = new Customer();
            let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/recommendations/${chatbot.customer_id}/${chatbot.category_id}`;
            let worker_token = sessionStorage.getItem('token');
            let returnedData = await call_api.getchatbotData(link_api,{"remember_token":worker_token,...chatbot});
            // console.log(returnedData.workers);
            if(returnedData.success&&(Array.from((returnedData.workers))).length!==0){
                setchatbotsanai3i(returnedData.workers);
            }else{
                setchatbotsanai3i([]);
            }
            setMessage(undefined);
            setshowchatbotsanai3i(true);
            setChatBot({});
            setStateOpen(false);
        }
    }
    const getWorkers = async(category_id,city_id,quality_rate,time_rate,price_rate)=>{
        const obj = {category_id,city_id,quality_rate,price_rate,time_rate}
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/filtration`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData = await call_api.Postdata(link_api,{...obj},{"remember_token":worker_token});
        if([...(Object.values(returnedData))][0]==="no data found"){
            setSanai3i([]);
        }else{
            // console.log([...(Object.values(returnedData))]);
            setSanai3i([...(Object.values(returnedData))]);
        }
    }
    const getCategories = async()=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/categories`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":worker_token});
        setCategories([...(returnedData.categories)]);
    }
    const getRegions = async()=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/all-region`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData = await call_api.getAlldata(link_api,{"remember_token":worker_token});
        setRegions([...(returnedData.region)]);
    }
    useEffect(()=>{
        getWorkers();
        getCategories();
        getRegions();
    },[]);
    return (
        <>
            <div className='search'>
                <div className='container'>
                    <div className='worker-container d-flex flex-column w-80'>
                        <div className='sanai3ia w-100'>
                            <h3 content="نتائج البحث">نتائج البحث</h3>
                            <div className='sanai3i-cards'>
                                {
                                    (sanai3i!==undefined)?(sanai3i.length!==0)?sanai3i.map((el)=>{
                                        return(<div className='card' key={el.id}>
                                        <img src={(el.image!==null)?`data:image/png;base64, ${el.image}`:personalImage} alt="personalImage" />
                                            <div className='card-header'>
                                                    <p><i className="bi bi-person-lines-fill ms-1"></i>{el.name}</p>
                                                    <p><i className="bi bi-person-workspace ms-1"></i>{el.phone}</p>
                                                    <p><i className="bi bi-geo-alt-fill ms-1"></i>{el.address}</p>
                                                    <button className='btn btn-custom'>
                                                    <Link className='custom-Link' to={`/ShowWorker/${el.id}`}>معرفه المزيد</Link></button>
                                            </div>
                                        </div>)
                                    }):<div className='w-100 text-center'>لا يوجد اى عمال</div>:<div className='empty'></div>
                                }
                            </div>
                        </div>
                        {
                            (showchatbotsanai3i&&(chatbotsanai3i!==undefined))&&<SearchChat chatbotsanai3i={chatbotsanai3i} />
                        }
                    </div>
                    <aside className='sidebar-search'>
                        <div className='filters'>
                            <div className='toggel'>
                                {
                                    (Categoriesopen===false)?<i className='bi bi-plus' onClick={()=>{
                                        setCategoriesopen(true);
                                    }}></i>:<i className='bi bi-dash' onClick={()=>{
                                        setCategoriesopen(false);
                                    }}></i>
                                }
                                <h5>بحث فى التخصصات</h5>
                            </div>
                            {(Categoriesopen===true)&&<div className='checkboxes custom-checkboxes'>
                                {
                                    (categories!==undefined)?categories.map((el,index)=>{
                                        return(
                                            <label className="checkbox" key={index} style={{cursor:"pointer"}} htmlFor={el.id}>
                                                <input type="radio" checked={el.id===Number((data.current).category_id)} style={{cursor:"pointer"}}   id={el.id} value={el.id}  name='category' onChange={(e)=>{
                                                    data.current = {...(data.current),category_id:e.target.value};
                                                    getWorkers(data.current.category_id,data.current.city_id,data.current.quality_rate,data.current.time_rate,data.current.price_rate);
                                                }}/>
                                                <span className="checkbox-title">{el.name}</span>
                                            </label>
                                        );
                                    }):<div className='empty'></div>
                                }
                            </div>}
                        </div>
                        <div className='filters mt-2'>
                            <div className='toggel'>
                                {
                                    (citiesopen===false)?<i className='bi bi-plus' onClick={()=>{
                                        setcitiesopen(true);
                                    }}></i>:<i className='bi bi-dash' onClick={()=>{
                                        setcitiesopen(false);
                                    }}></i>
                                }
                                <h5>بحث فى المدن</h5>
                            </div>
                            {(citiesopen===true)&&<div className='checkboxes'>
                                {
                                    (regions!==undefined)?regions.map((el,index)=>{
                                        return(
                                            <label className="checkbox" key={index} htmlFor={el.id} style={{cursor:"pointer"}} >
                                                <input type="radio" style={{cursor:"pointer"}}  id={el.id} value={el.id} checked={(el.id===Number((data.current).city_id))} name='region' onChange={(e)=>{
                                                    data.current = {...(data.current),city_id:e.target.value};
                                                    getWorkers(data.current.category_id,data.current.city_id,data.current.quality_rate,data.current.time_rate,data.current.price_rate);
                                                }}/>
                                                <span className="checkbox-title">{el.city_name}</span>
                                            </label>
                                        );
                                    }):<div className='empty'></div>
                                }
                            </div>}
                        </div>
                        <div className='filters mt-2'>
                            <div className='toggel'>
                                {
                                    (RateQualitopen===false)?<i className='bi bi-plus' onClick={()=>{
                                        setRateQualitopen(true);
                                    }}></i>:<i className='bi bi-dash' onClick={()=>{
                                        setRateQualitopen(false);
                                    }}></i>
                                }
                                <h5>بحث بالجوده</h5>
                            </div>
                            {(RateQualitopen===true)&&<div className='checkboxes custom-checkboxes'>
                                {
                                    [1,2,3,4,5].map((el,index)=>{
                                        return(
                                            <label className="checkbox" key={index} style={{cursor:"pointer"}} htmlFor={index}>
                                                <input type="radio" checked={el===Number((data.current).quality_rate)} style={{cursor:"pointer"}}   id={index} value={el}  name='quality_rate' onChange={(e)=>{
                                                    data.current = {...(data.current),quality_rate:e.target.value};
                                                    getWorkers(data.current.category_id,data.current.city_id,data.current.quality_rate,data.current.time_rate,data.current.price_rate);
                                                }}/>
                                                <span className="checkbox-title">{
                                                    (new Array(el).fill(5)).map((ell,index)=>{
                                                        return(
                                                            <i key={index} className={"bi bi-star-fill ms-1 star"}></i>
                                                        );
                                                    })
                                                }</span>
                                            </label>
                                        );
                                    })
                                }
                            </div>}
                        </div>
                        <div className='filters mt-2'>
                            <div className='toggel'>
                                {
                                    (RateTimeopen===false)?<i className='bi bi-plus' onClick={()=>{
                                        setRateTimeopen(true);
                                    }}></i>:<i className='bi bi-dash' onClick={()=>{
                                        setRateTimeopen(false);
                                    }}></i>
                                }
                                <h5>بحث بالوقت</h5>
                            </div>
                            {(RateTimeopen===true)&&<div className='checkboxes custom-checkboxes'>
                                {
                                    [1,2,3,4,5].map((el,index)=>{
                                        return(
                                            <label className="checkbox" key={index} style={{cursor:"pointer"}} htmlFor={index}>
                                                <input type="radio" checked={el===Number((data.current).time_rate)} style={{cursor:"pointer"}}   id={index} value={el}  name='time_rate' onChange={(e)=>{
                                                    data.current = {...(data.current),time_rate:e.target.value};
                                                    getWorkers(data.current.category_id,data.current.city_id,data.current.quality_rate,data.current.time_rate,data.current.price_rate);
                                                }}/>
                                                <span className="checkbox-title">{
                                                    (new Array(el).fill(5)).map((el,index)=>{
                                                        return(
                                                            <i key={index} className={"bi bi-star-fill ms-1 star"}></i>
                                                        );
                                                    })
                                                }</span>
                                            </label>
                                        );
                                    })
                                }
                            </div>}
                        </div>
                        <div className='filters mt-2'>
                            <div className='toggel'>
                                {
                                    (RatePricetopen===false)?<i className='bi bi-plus' onClick={()=>{
                                        setRatePricetopen(true);
                                    }}></i>:<i className='bi bi-dash' onClick={()=>{
                                        setRatePricetopen(false);
                                    }}></i>
                                }
                                <h5>بحث بالسعر</h5>
                            </div>
                            {(RatePricetopen===true)&&<div className='checkboxes custom-checkboxes'>
                                {
                                    [1,2,3,4,5].map((el,index)=>{
                                        return(
                                            <label className="checkbox" key={index} style={{cursor:"pointer"}} htmlFor={index}>
                                                <input type="radio" checked={el===Number((data.current).price_rate)} style={{cursor:"pointer"}}   id={index} value={el}  name='price_rate' onChange={(e)=>{
                                                    data.current = {...(data.current),price_rate:e.target.value};
                                                    getWorkers(data.current.category_id,data.current.city_id,data.current.price_rate);
                                                }}/>
                                                <span className="checkbox-title">{
                                                    (new Array(el).fill(5)).map((el,index)=>{
                                                        return(
                                                            <i key={index} className={"bi bi-star-fill ms-1 star"}></i>
                                                        );
                                                    })
                                                }</span>
                                            </label>
                                        );
                                    })
                                }
                            </div>}
                        </div>
                        <div className='mt-2 w-100 d-flex justify-content-end align-items-center'>
                            <button className='btn btn-danger text-white' onClick={()=>{
                                data.current = {};
                                getWorkers();
                            }}>حذف الفلاتر</button>
                        </div>
                    </aside>
                </div>
            </div>
            <div className='chatbot' >
                <i className={`${(stateopen)?"bi bi-x-circle-fill":"bi bi-chat-dots-fill"}`} onClick={(e)=>{
                    setStateOpen(!stateopen);
                }}></i>
                {
                    (stateopen)&&<div className='chatbot-write'>
                        <div className='chatbot-header'>
                            <img src={chabotImage} alt='chabotImage' />
                            <span>Sanai3i</span>
                        </div>
                        <div className='chatbot-body mt-2'>
                            <p className='chatbot-me' >مرحبا انا هنا لمساعدتك .</p>
                            <p className='chatbot-me'>اختر التخصص الذى تريده من القائمه فى الاسفل .</p>
                            <form className='w-100' onSubmit={(e)=>{
                                e.preventDefault();
                                handleChatbot();
                                setshowchatbotsanai3i(false);
                            }}>
                                <select  dir='rtl' className="form-select mb-3 chatbot-me" required aria-label="Default select example" onChange={(e)=>{
                                    setChatBot({...chatbot,category_id:e.target.value,customer_id:(Number(sessionStorage.getItem('currentid')))});
                                }}>
                                    <option >اختار التخصص</option>
                                    {categories!==undefined&&
                                        categories.map((el)=>{
                                            return (<option key={el.id} value={el.id}>{el.name}</option>);
                                        })
                                    }
                                </select>
                                {(((massage!==undefined&&massage.category_id!==undefined)))&&<p className='fs-6 text-danger'>{massage.category_id}</p>}
                                <button className='btn btn-primary text-white fs-6'>ارسال</button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
export default Search;

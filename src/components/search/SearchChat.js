import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {faker} from '@faker-js/faker';
import Admin from '../../logic/parent';
import chabotImage from '../../Assets/images/chatbot.jpg';
import personalImage from '../../Assets/images/user.jpg';
import { Link } from 'react-router-dom';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SearchChat({chatbotsanai3i}) {
    let [workernames,setworkernames] = useState(undefined);
    let [workers,setWorkers] = useState(undefined);
    let [workerstimerate,setworkerstimerate] = useState(undefined);
    let [workersqualityrates,setworkersqualityrates] = useState(undefined);
    let [workerspricerates,setworkerspricerates] = useState(undefined);
    useEffect(()=>{
        const workernamescur = [];
        const workeridscur = [];
        const workerstimeratecur = [];
        const workersqualityratescur = [];
        const workerspriceratescur = [];
        (Array.from(chatbotsanai3i)).forEach(element => {
            workernamescur.push(element.name);
            workeridscur.push(element.id);
            workerstimeratecur.push(parseInt(element.time_rate));
            workersqualityratescur.push(parseInt(element.quality_rate));
            workerspriceratescur.push(parseInt(element.price_rate));
        })
        setworkernames(workernamescur);
        setWorkers(chatbotsanai3i);
        setworkerstimerate(workerstimeratecur);
        setworkersqualityrates(workersqualityratescur);
        setworkerspricerates(workerspriceratescur);
    },[]);
    const data = {
        labels:(workernames!==undefined)?workernames:[],
        datasets: [
            {
                label: 'Quality Rate',
                data:(workersqualityrates!==undefined)?workersqualityrates:[],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Time Rate',
                data:(workerstimerate!==undefined)?workerstimerate:[],
                backgroundColor: 'rgba(20, 100, 235, 0.5)',
            },
            {
                label: 'Price Rate',
                data: (workerspricerates!==undefined)?workerspricerates:[],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'vertical Bar Chart',
            },
        }
    };
    return (
        <div className='sanai3ia w-100'>
            <div className='custom-boot-head w-100'>
                <h3 content="اقتراحاتى">اقتراحاتى</h3>
                <img src={chabotImage} alt='chabotImage' />
            </div>
            {(chatbotsanai3i.length!==0)?<div className='w-100 sanai3i-cards'> 
                {
                    (workernames!==undefined)?<Bar className='charts' style={{maxHeight:'350px',maxWidth:'100%'}} options={options}  data={data} />:<div className='w-100 d-flex justify-content-center align-items-center p-2'><div className='empty'></div></div>
                }
                <div className='w-100 d-flex flex-column align-items-center'>
                    <hr />
                    <h3 content="الصنايعيه">الصنايعيه</h3>
                    <div className='sanai3i-cards'> 
                        {
                            (workers!==undefined)?(workers.length!==0)?workers.map((el,index)=>{
                                return (
                                    <div className='card border-0 d-flex flex-column' key={index} >
                                        <div  className='w-100 card' >
                                            <img src={(el.image!==null)?`data:image/png;base64, ${el.image}`:personalImage} alt="personalImage" />
                                            <div className='card-header'>
                                                    <p><i className="bi bi-person-lines-fill ms-1"></i>{el.name}</p>
                                                    <p><i className="bi bi-person-workspace ms-1"></i>{el.phone}</p>
                                                    <p><i className="bi bi-geo-alt-fill ms-1"></i>{el.address}</p>
                                                    <button className='btn btn-custom'>
                                                    <Link className='custom-Link' to={`/ShowWorker/${el.id}`}>معرفه المزيد</Link></button>
                                            </div>
                                            {
                                                (el.time_rate===0&&el.quality_rate===0&&el.price_rate===0)&&<div className='status-new'>جديد</div>
                                            }
                                        </div>
                                        <span className='place-style'>{(el.place)?"فى منطقتك":"خارج منطقتك"}</span>
                                    </div>)
                            }):<div className='w-100 text-center'>لا يوجد اى عمال</div>:<div className='empty'></div>
                        }
                    </div>
                </div>
            </div>:<div>لا يوجد عمال فى الاقتراحات</div>}
        </div>
    )
}

export default SearchChat;
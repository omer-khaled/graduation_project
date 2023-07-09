import React, { useEffect, useRef, useState } from 'react'
import visa_word from '../Assets/images/visa.png'
import chip from '../Assets/images/chip.png'
import { motion , AnimatePresence} from 'framer-motion';
import { Rating } from 'react-simple-star-rating'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Customer from '../logic/customer';
export default function Payment({children,getcontracts,contractDetails,setOpenpayment,paymentType}) {
    const [years,setYears] = useState([]);
    const months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const [openvisa,setOpenVisa] = useState(true);
    const [data,setData] = useState({
        contract_id:contractDetails.id,
    });
    const [paymentComplete,setpaymentComplete] = useState(true);
    const [currentStatus,setCureentStatus] = useState(contractDetails.status);
    const cardNuumberRef = useRef(null);
    const cardHolderRef = useRef(null);
    const cardexp_month_yearRef = useRef(null);
    const [Errormessage,setErrormessage] = useState({});
    const [datarate, setDataRate] = useState({
        customer_id:contractDetails.user_id,
        worker_id:contractDetails.worker_id,
        contract_id:contractDetails.id,
    });
    const handleRating = async()=>{
        if(datarate.quality_rate!==undefined&&datarate.price_rate!==undefined&&datarate.time_rate!==undefined){
            let call_api = new Customer();
            let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/rate`;
            let worker_token = sessionStorage.getItem('token');
            let returnedData =await call_api.Postdata(link_api,{...datarate},{"remember_token":worker_token});
            const MySwal = withReactContent(Swal);
            if(returnedData.success){
                MySwal.fire({
                    title: <strong>{returnedData.message}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'success',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                }).then(function() {
                    setOpenpayment(false);
                    getcontracts();
                });
            }else{
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>{(returnedData.message!==undefined)&&returnedData.message}</strong>,
                    html: <i>اضغط على الزر</i>,
                    icon: 'error',
                    confirmButtonColor: '#0753b9',
                    confirmButtonText:'موافق',
                })
            }
        }else{
            const errorobj ={};
            if(datarate.quality_rate===undefined){
                    errorobj.quality_rate='برجاء تقيم العامل من حيث الجوده';
            }if(datarate.price_rate===undefined){
                    errorobj.price_rate='برجاء تقيم العامل من حيث السعر';
            }if(datarate.time_rate===undefined){
                    errorobj.time_rate='برجاء تقيم العامل من حيث الوقت';
            }
            // console.log
            setErrormessage({...errorobj});
        }
    }
    const handlepayment =   async()=>{
        let call_api = new Customer();
        let link_api = `http://127.0.0.1:8000/api/sanai3i/customer/payment`;
        let worker_token = sessionStorage.getItem('token');
        let returnedData =await call_api.Postdata(link_api,{...data},{"remember_token":worker_token});
        const MySwal = withReactContent(Swal);
        if(returnedData.message==='succeeded'){
            MySwal.fire({
                title: <strong>{"تم الدفع بنجاح"}</strong>,
                html: <i>اضغط على الزر</i>,
                icon: 'success',
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            }).then(function() {
                getcontracts();
                setpaymentComplete(false);
                setOpenVisa(false);
                setCureentStatus(1);
            });
        }else{
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: <strong>{"حدث خطا اثناء الدفع تاكد من ملعومات الكارت"}</strong>,
                html: <i>اضغط على الزر</i>,
                icon: 'error',
                confirmButtonColor: '#0753b9',
                confirmButtonText:'موافق',
            })
        }
    }
    useEffect(()=>{
        let arr_years = [];
        for(let i=0;i<10;i++){
            arr_years.push(((new Date()).getFullYear())+i);
        }
        setYears([...arr_years]);
        // console.log(contractDetails.status);
        if(currentStatus===1){
            setpaymentComplete(false);
        }
        // console.log(Errormessage);
    },[])
    return (
        <div className='payment'>
            <AnimatePresence>
                {(openvisa&&paymentType==='فيزا'&&paymentComplete)?<motion.div 
                    key={'box1'}
                    initial={{opacity:0,y:"50%",scale:0.5}}
                    animate={{opacity:1,y:0,scale:1}}
                    transition={{duration:0.5,ease:'linear'}}
                    exit={{y:"50%",opacity:0}}
                    className='visa-cover'>
                {children}
                <i className="bi bi-arrow-right-square-fill" onClick={()=>{
                    setOpenVisa(false);
                }}></i>
                <div className='visa-card'>
                    <div className='visa-images'>
                        <img src={chip} id='chip' alt={'chip'}></img>
                        <img src={visa_word} alt={'visa'}></img>
                    </div>
                    <p className='mt-3' ref={cardNuumberRef}>#### #### #### ####</p>
                    <div className='visa-details mt-2'>
                        <div className='custom-details'>
                            <span>CARD HOLDER</span>
                            <span className='ps-1' ref={cardHolderRef}>FULL NAME</span>
                        </div>
                        <div className='custom-details'>
                            <span>EXPIRES</span>
                            <span className='ps-1' ref={cardexp_month_yearRef}>MM / YY</span>
                        </div>
                    </div>
                </div>
                <form className='payment-form' onSubmit={(e)=>{
                    e.preventDefault();
                    handlepayment();
                }}>
                    <div className='control-anim'>
                        <span>رقم البطاقه</span>
                        <input className='form-control mb-3' required type={'text'} onChange={(e)=>{
                            const current_value = e.target.value;
                            if(current_value.length>16){
                                e.target.value = current_value.slice(0,16);
                            }
                            if(current_value.length<=16){
                                const str=(current_value+('#'.repeat(16-(current_value.length))));
                                const curCardNumber = str.match(/.{4}/g);
                                (cardNuumberRef.current).innerText=curCardNumber.join(' ');
                            }
                            setData({...data,number:e.target.value});
                        }}/>
                    </div>
                    <div className='control-anim'>
                        <div className="custom-control">
                            <span>المبلغ المدفوع</span>
                            <input className='form-control mb-3' required type={'number'} onChange={(e)=>{
                                setData({...data,amount:e.target.value});
                            }}/>
                        </div>
                        <div className='custom-control ' dir='rtl'>
                            <span>cvc</span>
                            <input className='form-control mb-3' required type={'text'} onChange={(e)=>{
                                if((e.target.value).length>3){
                                    e.target.value = (e.target.value).slice(0,3);
                                }
                                if((e.target.value).length===0){
                                    (cardHolderRef.current).innerText="FULL NAME";
                                }else{
                                    (cardHolderRef.current).innerText=e.target.value;
                                }
                                setData({...data,cvc:e.target.value});
                            }}/>
                        </div>
                    </div>
                    <div className='control-anim'>
                        <div className="custom-control">
                            <span>شهر الانتهاء</span>
                            <select className="form-select mb-3" required aria-label="Default select example" onChange={(e)=>{
                                let [,year_handler] = (cardexp_month_yearRef.current.innerText).split(' / '); 
                                if((e.target.value).length===0){
                                    (cardexp_month_yearRef.current).innerText="MM"+" / "+year_handler;
                                }else{
                                    let valeumonth = Number(e.target.value)+1;
                                    let cur_Month = (valeumonth<=9)?("0"+valeumonth):valeumonth;
                                    (cardexp_month_yearRef.current).innerText=(cur_Month)+" / "+year_handler;
                                }
                                setData({...data,exp_month:e.target.value});
                            }}>
                                <option></option>
                                {months!==undefined&&
                                    months.map((el,index)=>{
                                        return (<option key={index} value={index}>{el}</option>);
                                    })
                                }
                            </select>
                        </div>
                        <div className='custom-control'>
                            <span>سنه الانتهاء</span>
                            <select className="form-select mb-3" required aria-label="Default select example" onChange={(e)=>{
                                let [month_handler,] = (cardexp_month_yearRef.current.innerText).split(' / '); 
                                if((e.target.value).length===0){
                                    (cardexp_month_yearRef.current).innerText=month_handler+" / "+"YY";
                                }else{
                                    let valeumonth = Number(e.target.value);
                                    (cardexp_month_yearRef.current).innerText=month_handler+" / "+valeumonth;
                                }
                                setData({...data,exp_year:e.target.value});
                            }}>
                                <option></option>
                                {years!==undefined&&
                                    years.map((el,index)=>{
                                        return (<option key={index} value={el}>{el}</option>);
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={`btn w-100 btn-primary btn-brand`}>دفع</button>
                </form>
                </motion.div>:((paymentType==='كاش')?<motion.div 
                    key={'box2'}
                    initial={{opacity:0,y:"50%",scale:0.5}}
                    animate={{opacity:1,y:0,scale:1}}
                    transition={{duration:0.5,ease:'linear'}}
                    exit={{y:"50%",opacity:0}}
                    id='rating'>
                    {children}
                    <p className='text-center fs-4 custom-tak'>تقييم العامل</p>
                    <div className='rate-details mt-1'>
                        <Rating
                            onClick={(rate)=>{
                                setDataRate({...datarate,time_rate:rate});
                            }}
                            allowFraction
                            transition
                        />
                        <span className='span-details'>الوقت</span>
                    </div>
                    {(Errormessage.time_rate!==undefined)&&<span className='w-100 text-center'>{Errormessage.time_rate}</span>}
                    <div className='rate-details mt-1'>
                        <Rating
                            onClick={(rate)=>{
                                setDataRate({...datarate,price_rate:rate});
                            }}
                            allowFraction
                            transition
                        />
                        <span className='span-details'>السعر</span>
                    </div>
                    {(Errormessage.price_rate!==undefined)&&<span className='w-100 text-center'>{Errormessage.price_rate}</span>}
                    <div className='rate-details mt-1'>
                        <Rating
                            onClick={(rate)=>{
                                setDataRate({...datarate,quality_rate:rate});
                            }}
                            allowFraction
                            transition
                        />
                        <span className='span-details'>الجوده</span>
                    </div>
                    {(Errormessage.quality_rate!==undefined)&&<span className='w-100 text-center'>{Errormessage.quality_rate}</span>}
                    <div className='d-flex justify-content-center mt-3'>
                        <button onClick={()=>{
                            handleRating();
                        }} className='btn btn-primary cust-white'>اكمال التقيم</button>
                    </div>
                </motion.div>:<motion.div 
                key={'box2'}
                initial={{opacity:0,y:"50%",scale:0.5}}
                animate={{opacity:1,y:0,scale:1}}
                transition={{duration:0.5,ease:'linear'}}
                exit={{y:"50%",opacity:0}}
                id='rating'>
                {(paymentComplete)?<i className="bi bi-arrow-left-square-fill" onClick={()=>{
                    setOpenVisa(true);
                }}></i>:children}
                <p className='text-center fs-4 custom-tak'>تقييم العامل</p>
                <div className='rate-details mt-1'>
                    <Rating
                        onClick={(rate)=>{
                            setDataRate({...datarate,time_rate:rate});
                        }}
                        allowFraction
                        transition
                    />
                    <span className='span-details'>الوقت</span>
                </div>
                {(Errormessage.time_rate!==undefined)&&<span className='w-100 text-center'>{Errormessage.time_rate}</span>}
                <div className='rate-details mt-1'>
                    <Rating
                        onClick={(rate)=>{
                            setDataRate({...datarate,price_rate:rate});
                        }}
                        allowFraction
                        transition
                    />
                    <span className='span-details'>السعر</span>
                </div>
                {(Errormessage.price_rate!==undefined)&&<span className='w-100 text-center'>{Errormessage.price_rate}</span>}
                <div className='rate-details mt-1'>
                    <Rating
                        onClick={(rate)=>{
                            setDataRate({...datarate,quality_rate:rate});
                        }}
                        allowFraction
                        transition
                    />
                    <span className='span-details'>الجوده</span>
                </div>
                {(Errormessage.quality_rate!==undefined)&&<span className='w-100 text-center'>{Errormessage.quality_rate}</span>}
                <div className='d-flex justify-content-center mt-3'>
                    <button onClick={()=>{
                        handleRating();
                    }} className='btn btn-primary cust-white'>اكمال التقيم</button>
                </div>
            </motion.div>)}
            </AnimatePresence>
        </div>
    )
}

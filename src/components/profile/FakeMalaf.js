import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
function FakeMalaf({role}) {
    return (
        <div className='container main mt-4'>
            <div className='more-details'>
                <p className='success'>إحصائيات</p>
                <div className='hr my-3'></div>
                <div className='details-info'>
                    <div className='sub-details-info mb-2' dir='rtl'>
                        <p className='success'>الخدمات المكتمله</p>
                        <Skeleton  className='skelton' width={"30px"} />
                    </div>
                    <div className='sub-details-info mb-2' dir='rtl'>
                        <p className='success'>عدد العملاء</p>
                        <Skeleton  className='skelton' width={"30px"} />
                    </div>
                    <div className='sub-details-info' dir='rtl'>
                        <p className='success'>تاريخ الانضمام</p>
                        <Skeleton  className='skelton' width={"200px"} />
                    </div>
                </div>
            </div>
            {(role!=='c')&&<div className='simple-updates'>
                <div className='nabza'>
                    <div className='nabze-update'>
                        <i className="bi bi-pencil-fill"></i>
                        <p className='success'>نبذة عني</p>
                    </div>
                    <div className='hr my-3'></div>
                    <Skeleton  className='skelton me-2 mb-2' width={"200px"} />
                </div>
                <div className='nabza mt-3'>
                    <div className='nabze-update'>
                        <i className="bi bi-pencil-fill"></i>
                        <p className='success'>خدماتي</p>
                    </div>
                    <div className='hr my-3'></div>
                    <div className='row w-100 pb-2 mx-0 justify-content-between align-items-center'>
                        <div className='col-3'>
                            <Skeleton className='skelton' width={"100%"} height={"140px"}/>
                        </div>
                        <div className='col-3'>
                            <Skeleton className='skelton' width={"100%"} height={"140px"}/>
                        </div>
                        <div className='col-3'>
                            <Skeleton className='skelton' width={"100%"} height={"140px"}/>
                        </div>
                        <div className='col-3'>
                            <Skeleton className='skelton' width={"100%"} height={"140px"}/>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
export default FakeMalaf;


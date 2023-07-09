import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import FakeMalaf from './FakeMalaf'
export default function FakePersonal({type,role}) {
    return (
        <React.Fragment>
            <div className='personal-info'>
                <div className='container'>
                    <div className='rate'>
                        <Skeleton className='skelton' width={"150px"} />
                    </div>
                    <div className='main-details'>
                        <Skeleton circle width={"200px"} height={"200px"}/>
                        <Skeleton />
                        <div className='details mt-1' dir='rtl'>
                            <div className='sub-info ms-2'>
                                <i className="bi bi-tag-fill fs-6 seconde ms-1"></i>
                                <Skeleton  className='skelton' width={"150px"} />
                            </div>
                            <div className='sub-info ms-2'>
                                <i className="bi bi-geo-alt-fill fs-6 seconde ms-1"></i>
                                <Skeleton className='skelton' width={"150px"} />
                            </div>
                        </div>
                    </div>
                    <div className='updates mt-3'>
                        <button className='btn btn-success success mb-2' disabled={true}>تعديل الملف الشخصى</button>
                        <button className='btn btn-success success mb-2' disabled={true}>تعديل الرقم السرى</button>
                        <div className='tabs'>
                            <div className={`sub-info ms-2 p-2 checked`} >
                                <span className='fs-5 success'>الملف الشخصى</span>
                                <i className="bi bi-person-fill fs-6 success ms-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {<FakeMalaf role={role}/>}
        </React.Fragment>
    )
}

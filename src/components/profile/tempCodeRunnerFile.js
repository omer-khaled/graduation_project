import React from 'react'

function Malaf() {
    return (
        <div className='container main mt-4'>
            <div className='more-details'>
                <p className='success'>إحصائيات</p>
                <div className='hr my-3'></div>
                <div className='details-info'>
                    <div className='sub-details-info mb-2' dir='rtl'>
                        <p className='success'>الخدمات المكتمله</p>
                        <p className='success'>0</p>
                    </div>
                    <div className='sub-details-info mb-2' dir='rtl'>
                        <p className='success'>عدد العملاء</p>
                        <p className='success'>0</p>
                    </div>
                    <div className='sub-details-info' dir='rtl'>
                        <p className='success'>تاريخ الانضمام</p>
                        <p className='success'>17 مارس 2022</p>
                    </div>
                </div>
            </div>
            <div className='simple-updates'>
                <div className='nabza'>
                    <div className='nabze-update'>
                        <i className="bi bi-pencil-fill"></i>
                        <p className='success'>نبذة عني</p>
                    </div>
                    <div className='hr my-3'></div>
                    <p className='success value'>لم يكتب نبذة شخصية</p>
                </div>
                <div className='nabza mt-3'>
                    <div className='nabze-update'>
                        <i className="bi bi-pencil-fill"></i>
                        <p className='success'>خدماتي</p>
                    </div>
                    <div className='hr my-3'></div>
                    <p className='success value'>لا توجد خدمات بعد</p>
                </div>
            </div> 
        </div>
    )
}
export default Malaf;

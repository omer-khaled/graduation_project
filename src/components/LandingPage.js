import React, { createContext, useState } from 'react'
import Signup from './Landingpage/Signup';
export let context = createContext();
function LandingPage() {
    let [state,setState] = useState('');
    return (
        <context.Provider value={{state,setState}}>
            <section className='landing w-100'>
                <Signup />
            </section>
        </context.Provider>
    )
}
export default LandingPage;
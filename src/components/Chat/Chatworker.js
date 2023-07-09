import React from 'react'
import ActualChat from './ActualChat'
import { useParams } from 'react-router-dom';

export default function Chatworker({role}) {
    const {id}  =useParams();
    const currentID = sessionStorage.getItem('currentid');
    return (
        <div className='chat-cover'>
            <ActualChat role={role} anotherid={id} id={currentID}/>
        </div>
    )
}

import React, { useEffect, useRef, useState } from 'react'
import Worker from '../../logic/worker';
import Customer from '../../logic/customer';
import personalImage from '../../Assets/images/user.jpg';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import {  db, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
export default function ActualChat({role,anotherid,id}) {
    const [user,setUser] = useState(undefined);
    const [upload,setUploade] = useState(true);
    const [messages,setMessages] = useState(undefined);
    const [data,setData] = useState({
        sender_type: (role==='user')?"customer":"worker",
        sender_id:id,
        receiver_type: (role==='user')?"worker":"customer",
        receiver_id:anotherid,
    });
    const [firedata,setFireData] = useState({
        sender_type: (role==='user')?"customer":"worker",
        customID:`${id}-${anotherid}`,
        receiver_type: (role==='user')?"worker":"customer",
    });
    const [check,setCheck] = useState(true);
    const inputRef = useRef();
    const messagesEndRef = useRef(null);
    const getProfile = async()=>{
        let call_api = (role!=='user')?new Customer():new Worker();
        let link_api = (role!=='user')?"http://127.0.0.1:8000/api/sanai3i/customer/profile":"http://127.0.0.1:8000/api/sanai3i/worker/worker-profile";
        let workerToken = sessionStorage.getItem('token');
        let returnedData = await call_api.getdata(link_api,anotherid,{"remember_token":workerToken});
        console.log(returnedData);
        setUser((role!=='worker')?{...returnedData}:({...returnedData}.customer));
    }
    const getMessages = async()=>{
        try{
            const q = query(collection(db, "chats"),where("customID","in",[`${id}-${anotherid}`,`${anotherid}-${id}`]),orderBy('timeStamp','asc'));
            onSnapshot(q, (querySnapshot) => {
                const chating = [];
                querySnapshot.forEach((doc) => {
                    chating.push({...doc.data(),id:doc.id});
                });
                setMessages([...chating]);
                setCheck(!check);
            });
        }catch(err){
            console.log(err);
        }
    }
    const handleImage = async(file)=>{
        const displayNAme = new Date().getTime() + file.name;
        const storageRef  = ref(storage, displayNAme);
        const uploadTask  = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            }, 
            (error) => {
                console.log(error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFireData({...firedata,image:`${downloadURL}`});
                    setUploade(true);
                });
            }
        );
    }
    const handleSendmessage = async()=>{
        inputRef.current.value='';
        let call_api = (role==='user')?new Customer():new Worker();
        let link_api = (role==='user')?"http://127.0.0.1:8000/api/sanai3i/customer/sendMessage":"http://127.0.0.1:8000/api/sanai3i/worker/sendMessage";
        let token = sessionStorage.getItem('token');
        let returnedData = await call_api.Postdata(link_api,{...data},{"remember_token":token});
        // setAnotheruser((role==='worker')?({...returnedData}.customer):{...returnedData});
    }
    const singupData = async(e)=>{
        try{
            if(firedata.image === undefined){
                await addDoc(collection(db,"chats"),{...firedata,timeStamp:serverTimestamp(),image:""});
            }else{
                await addDoc(collection(db,"chats"),{...firedata,timeStamp:serverTimestamp()});
            }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getProfile();
        getMessages();
    },[])
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView();
    },[messages])
    return (
        <div className='chat'>
            <div className='chat-message'>
                {(user!==undefined)&&<div className='chat-message-haeder'>
                    <img src={(user.image!==undefined)?`data:image/png;base64, ${user.image}`:personalImage} alt="personalImage" />
                    <span>{user.name}</span>
                </div>}
                <hr />
                <div className='chat-message-body'>
                    {
                        (messages!==undefined&&(messages.length!==0))&&(messages.map(el=>{
                            const senderid=(el.customID).split('-')[0];
                            const div_type = ((String(senderid)===String(id))&&((String(el.sender_type)===String(role))||(String(el.sender_type)==="customer"&&role==="user")))?"div-sender":"div-reciver";
                            const p_type = ((String(senderid)===String(id))&&((String(el.sender_type)===String(role))||(String(el.sender_type)==="customer"&&role==="user")))?"sender":"reciver";
                            return (<div className={div_type} key={el.id}>
                                    <p className={p_type}>{el.message}</p>
                                    {(el.image!=="")&&<img src={el.image} alt='imagemassage'/>}
                                    {
                                        (el.timeStamp)&&<p className='time'>{`${`${(el.timeStamp).toDate().toLocaleTimeString('ar-SA').split(' ')[0].slice(0,-3)}`} ${(((el.timeStamp).toDate().toLocaleTimeString().split(' ')[1])==='PM')?"م":"ص"}`}</p>
                                    }
                            </div>)
                        }))             
                    }
                    <div id='last' ref={messagesEndRef}></div>
                </div>
                <div className='chat-message-footer'>
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        handleSendmessage();
                        singupData();
                    }}>
                        <div className='input-control'>
                            <button disabled={upload===true?false:true} type='submit' className='send-message'><i className="bi bi-arrow-left-square-fill"></i></button>
                            <div className='file'>
                                <input type={"file"} accept="image/png, image/jpeg, image/jpg" name="userImage" onChange={(e)=>{
                                    let src = e.target.files[0];
                                    setUploade(false);
                                    handleImage(src);
                                }}/>
                                <i className="bi bi-cloud-plus-fill"></i>
                            </div>
                            <input ref={inputRef} disabled={upload===true?false:true} type='text' required onChange={(e)=>{
                                setData({...data,message:e.target.value})
                                setFireData({...firedata,message:e.target.value})
                            }} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


    // const getanotherProfile = async()=>{
    //         let call_api = (role==='user')?new Worker():new Customer();
    //         let link_api = (role==='user')?"http://127.0.0.1:8000/api/sanai3i/worker/worker-profile":"http://127.0.0.1:8000/api/sanai3i/customer/profile";
    //         let workerToken = sessionStorage.getItem('token');
    //         let returnedData = await call_api.getdata(link_api,anotherid,{"remember_token":workerToken});
    //         setAnotheruser((role==='worker')?({...returnedData}.customer):{...returnedData});
    // }
import axios from 'axios';
export default class Parent{
    
}
Parent.prototype.getdata = async (link,id,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}/${id}`,{
        headers: {...final_headers},
    });
    const res = await fetched.json();
    return {...res};
}
// chat getData
Parent.prototype.chatgetdata = async (link,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}`,{
        headers: {...final_headers},
    });
    const res = await fetched.json();
    return {...res};
}
// getchatbotData
Parent.prototype.getchatbotData = async (link,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}`,{
        headers: {...final_headers},
    });
    const res = await fetched.json();
    return {...res};
}
// General GEtData
Parent.prototype.getAlldata = async (link,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}`,{
        headers: {...final_headers},
    });
    const res = await fetched.json();
    return {...res};
}
// General POSTData
Parent.prototype.Postdata = async (link,obj,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}`,{
        method:"POST",
        headers:{...final_headers},
        body:JSON.stringify(obj),
    });
    const res = await fetched.json();
    return {...res};
}
// logout
Parent.prototype.Logout = async (link,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}`,{
        method:"POST",
        headers:{...final_headers},
    });
    const res = await fetched.json();
    return {...res};
}

// custom post
Parent.prototype.ServicePostdata = async (link,obj,Custom_headers)=>{
    let res =await axios.post(link, obj, {
        headers: {
            ...Custom_headers,
            'Content-Type': 'multipart/form-data'
        }
    }).catch(error=>{
        console.log(error.response.data);
    });
    return {...res};
}

// Deal With Categoru
Parent.prototype.dealdataCategory = async (link,obj,Custom_headers,id)=>{
    let finalLink = link;
    if(id!==undefined){
        finalLink+=`/${id}`;
    }
    let res =await axios.post(finalLink, obj, {
        headers: {
            ...Custom_headers,
            'Content-Type': 'multipart/form-data'
        }
    }).catch(error=>{
        console.log(error.response.data);
    });
    return {...res};
}
// Get sngle contract
Parent.prototype.getSingleContract = async (link,Custom_headers,id)=>{
    let finalLink = link;
    if(id!==undefined){
        finalLink+=`/${id}`;
    }
    let res =await axios.get(finalLink, {
        headers: {
            ...Custom_headers,
            'Content-Type': 'multipart/form-data'
        }
    }).catch(error=>{
        console.log(error.response.data);
    });
    return {...res};
}
// ------------------
Parent.prototype.Putdata = async (link,id,obj,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}/${id}`,{
        method:"PUT",
        headers:{...final_headers},
        body:JSON.stringify(obj)
    });
    const res = await fetched.json();
    return {...res};
}
// update Status of user (active and deactive)
Parent.prototype.PutdataStatus = async (link,id,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}/${id}`,{
        method:"PUT",
        headers:{...final_headers}
    });
    const res = await fetched.json();
    return {...res};
}
// Delete roww
Parent.prototype.Deletdata = async (link,id,Custom_headers)=>{
    let final_headers = {
        "Content-Type": "application/json",
    }
    if(Custom_headers!==undefined&&Custom_headers!=={}){
        final_headers = {...final_headers,...Custom_headers};
    }
    const fetched = await fetch(`${link}/${id}`,{
        method:"DELETE",
        headers:{...final_headers},
    });
    const res = await fetched.json();
    return {...res};
}

// http://127.0.0.1:8000/api/admin/allusers/deletecustomer
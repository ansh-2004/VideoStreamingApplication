import axios from 'axios'

const API = axios.create({
    baseURL: "https://videoapplication-t59d.onrender.com/api"
})

//Attaching token with the request

API.interceptors.request.use((req)=>{
    const token = localStorage.getItem("token")
    if(token){
        req.headers.Authorization = `Bearer ${token}`
    }
    return req 
})

export default API 
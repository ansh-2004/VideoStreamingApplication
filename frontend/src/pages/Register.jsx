import { useState,useContext } from "react";

import {useNavigate,Link} from 'react-router-dom'
import API from '../utils/api'

import {AuthContext} from '../context/AuthContext'

export default function Register(){
    const [form,setForm] = useState({
        email: "",
        password: ""
    })

    const [error,setError] = useState("")
    const navigate = useNavigate()

    const {login} = useContext(AuthContext)

    const handleChange = (e)=>{
        setForm({...form,[e.target.name] : e.target.value})
    }

    const validate = ()=>{
        if(!form.email.includes("@")) return "Invalid email"
        if(form.password.length < 6) return "Password must be at least 6 characters"

        return null
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError("")

        const validation = validate()
        if(validation) return setError(validation)

        try {
            const res = await API.post("/auth/register",form)

            //auto login
            const loginRes = await API.post('/auth/login',form)

            login(loginRes.data)

            navigate("/dashboard")

        } catch (error) {
            console.log("error in register",error)
            setError(error.response?.data?.msg || "Something went wrong")
        }
    }

    return(
        <div style={{padding: "20px"}}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type = "email"
                    name= "email"
                    placeholder="Email"
                    onChange={handleChange}
                > 
                </input>
                <br></br>

                <input
                    type = "password"
                    name = "password"
                    placeholder="Password"
                    onChange={handleChange}
                >
                </input>
                <br></br>

                <button type="submit">Register</button>

            </form>

            {error && <p style={{color:"red"}}>{error}</p>}

            <p>
                Already have an account? <Link to="/"> Login</Link>
            </p>
        </div>
    )
}
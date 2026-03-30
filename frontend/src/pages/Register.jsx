import { useState,useContext } from "react";

import {useNavigate,Link} from 'react-router-dom'
import API from '../utils/api'

import {AuthContext} from '../context/AuthContext'

export default function Register(){
    const [form,setForm] = useState({
        email: "",
        password: "",
        role : "editor"
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
            console.log('res',res)
            //auto login
            const loginRes = await API.post('/auth/login',form)
            console.log('loginres',loginRes)
            login(loginRes.data)

            navigate("/dashboard")

        } catch (error) {
            console.log("error in register",error)
            setError(error.response?.data?.message || "Something went wrong")
        }
    }

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">

      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>

      </form>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          className="text-blue-500 cursor-pointer"
        >
          Login
        </span>
      </p>

    </div>
  </div>
);
}
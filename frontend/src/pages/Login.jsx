import { useState,useContext } from "react";

import {useNavigate,Link} from 'react-router-dom'
import API from '../utils/api'

import {AuthContext} from '../context/AuthContext'

export default function Login(){
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
        if(!form.password) return "Password is required"

        return null
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError("")

        const validation = validate()
        if(validation) return setError(validation)

        try {
            const res = await API.post("/auth/login",form)
            console.log('res',res)
            login(res.data)

            navigate("/dashboard")

        } catch (error) {
            console.log("error in login",error)
            setError(error.response?.data?.message || "Invalid Credentials")
        }
    }

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>

      </form>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-500 cursor-pointer"
        >
          Register
        </span>
      </p>

    </div>
  </div>
);
}

// ----


// import { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../utils/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     if (!form.email.includes("@")) return "Invalid email";
//     if (!form.password) return "Password is required";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const validation = validate();
//     if (validation) return setError(validation);

//     try {
//       const res = await API.post("/auth/login", form);
//       login(res.data);
//       navigate("/dashboard");
//     } catch (error) {
//       setError(error.response?.data?.msg || "Invalid Credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">

//         <h2 className="text-2xl font-semibold text-gray-800 mb-1 text-center">Welcome back</h2>
//         <p className="text-sm text-gray-400 text-center mb-6">Sign in to your account</p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-medium text-gray-600">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="you@example.com"
//               onChange={handleChange}
//               className="border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-medium text-gray-600">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="••••••••"
//               onChange={handleChange}
//               className="border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//             />
//           </div>

//           {error && (
//             <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition"
//           >
//             Sign in
//           </button>
//         </form>

//         <p className="text-sm mt-5 text-center text-gray-500">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-blue-500 hover:underline font-medium">
//             Register
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// }
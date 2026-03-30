import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Player from './pages/Player'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children})=>{
  const {user} = useContext(AuthContext)
  const token = localStorage.getItem("token");

 return user && token ? children : <Navigate to="/" />;
}
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>}>
        </Route>
        <Route path='/video/:id' element={<Player/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
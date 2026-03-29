import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import {Server} from 'socket.io'

dotenv.config()

import authRoutes from './routes/authRoutes.js'
import videoRoutes from './routes/videoRoutes.js'


const app = express()
const server = http.createServer(app)

// Socket io
export const io = new Server(server,{
    cors : {
        origin : "*",
    }
})

app.use(cors())
app.use(express.json())
app.use('/uploads',express.static("uploads"))

app.use('/api/auth',authRoutes)
app.use('/api/videos',videoRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected")
    server.listen(3000,()=> console.log(`Server running on port 3000`))
})
.catch((err)=> {
    console.log(err)
})


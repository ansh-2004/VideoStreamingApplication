import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import {Server} from 'server.io'

dotenv.config()

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

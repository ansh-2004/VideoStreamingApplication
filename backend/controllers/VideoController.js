import Video from "../models/Video.js";

import fs from 'fs'
import { io } from "../server.js";

export const videoUpload = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : "Video file is required"
            })
        }

        const {title} = req.body 

        if(!title || title.trim().length < 3){
            return res.status(400).json({
                success : false,
                message : "Title must be more than 3 characters"
            })
        }

        const video = await Video.create({
            title : title.trim(),
            filePath: req.file.path,
            userId : req.user.id,
            status: "processing"
        })

        // processing the video 
        videoProcess(video)

        return res.status(201).json({
            success : true,
            message : "Video uploaded successfuly",
            data : video 
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const videoProcess = async (video)=>{
    let progress = 0 
    const interval = setInterval(async ()=>{
        progress += 25 

        io.emit("progressVideo",{
            videoId : video._id,
            progress
        })

        if(progress >= 100){
            clearInterval(interval)

            let status = 'safe'

            const flaggedWords = ['violence','drugs','adult']
            const isFlagged = flaggedWords.some(word => video.title.toLowerCase().includes(word))

            status = isFlagged ? 'flagged' : 'safe'

            await Video.findByIdAndUpdate(video._id, {status})

            io.emit("videoCompleted",{
                videoId : video._id,
                status 
            })
        }
    },1000)
}

export const getVideos = async (req,res)=>{
    try {
        const videos = await Video.find({userId : req.user.id})
                                  .sort({createdAt : -1})
        
        return res.status(200).json({
            success : true,
            data : videos
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const getVideoByID = async (req,res)=>{
    try {
        const {id} = req.params 

        if(!id){
            return res.status(400).json({
                success : false,
                message : "Video id is requred"
            })
        }

        const video = await Video.findById(id)

        if(!video){
            return res.status(404).json({
                status : false,
                message : "video not found"
            })
        }

        // Authorization check
        if(video.userId.toString() !== req.user.id){
            return res.status(403).json({
                success : false,
                message : "Unauthorized access"
            })
        }

        if(video.status === 'flagged'){
            return res.status(403).json({
                success : false,
                message : "Video is flagged"
            })
        }

        return res.status(200).json({
            success : true,
            data : video
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}
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
            status: "processing",
            
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

            const flaggedWords = ['violence','drugs','adult','bad']
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
        const {status} = req.query

        let filter = {
            userId : req.user.id
        }
        if(status){
            filter.status = status
        }

        let videos;


        if (req.user.role === "viewer") {
        videos = await Video.find({ status: "safe" })
                            .sort({createdAt : -1})
      } else {
        videos = await Video.find(filter)
                            .sort({createdAt : -1})
      }

      if (req.user.role === "admin") {
        videos = await Video.find(); 
      }
        
        return res.status(200).json({
            success : true,
            data : videos
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

const getAuthorizedVideo = async (req) => {
  const { id } = req.params;

  if (!id) {
    throw { status: 400, message: "Video id is required" };
  }

  const video = await Video.findById(id);

  if (!video) {
    throw { status: 404, message: "Video not found" };
  }

//   if (video.userId.toString() !== req.user.id) {
//     throw { status: 403, message: "Unauthorized access" };
//   }

  if (video.status === "flagged") {
    throw { status: 403, message: "Video is flagged" };
  }

  return video;
};

export const getVideoByID = async (req,res)=>{
    try {
         
        const {video,error} = await getAuthorizedVideo(req,res)

        if(error) return;

        return res.status(200).json({
            success : true,
            data : video
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const videoStreaming = async (req, res) => {
  try {
    const video = await getAuthorizedVideo(req);

    const filePath = video.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (!range) {
      return res.status(400).json({
        success: false,
        message: "Range required",
      });
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return res.status(416).json({
        success: false,
        message: "Range not satisfiable",
      });
    }

    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);

  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
import multer from "multer";

import path from 'path'

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename: (req,file,cb) =>{
        const uniqueName = Date.now() + "-" + file.originalname 
        cb(null,uniqueName)
    }
})

// Validations for file 

const filterFile = (req,file,cb) =>{
    const typesAllowed = ["video/mp4","video/mkv","video/avi"]

    if(!typesAllowed.includes(file.mimetype)){
        return cb(new Error("Only video files are allowed"),false)

    }

    cb(null,true)
}

const upload = multer({
    storage,
    limits : {
        // 100 MB
        fileSize : 100 * 1024 * 1024  
    },
    filterFile

})

export default upload
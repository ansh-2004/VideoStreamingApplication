import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title : {
        type : String,
        required: true,
        trim : true
    },
    filePath : {
        type : String, 
        required : true
    },
    status : {
        type: String,
        enum : ['processing','safe','flagged'],
        default : 'processing'
    },
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }

},{timestamps : true })

export default mongoose.model("Video",videoSchema)


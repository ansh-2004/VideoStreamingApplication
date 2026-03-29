import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : String,
    password : String,
    role : {
        type : String ,
        enum : ["viewer","editor","admin"],
        default : "editor"
    },

})

export default mongoose.model("User",userSchema)
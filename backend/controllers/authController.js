import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req,res) =>{
    try {
        const {email,password,role} = req.body 
        
        const userFind = await User.findOne({ email: email });

        if (userFind) {
			return res.status(400).json({
				success: false,
				message: "You are already registered with us",
			});
		}

        const hashed = await bcrypt.hash(password,10)

        const user = await User.create({
            email,
            password : hashed,
            role: role
        })

        return res.status(200).json({
            success : true,
            data : user
        })



    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body 

        const user = await User.findOne({email})

        if(!user) return res.status(400).json({
            success : false,
            message : "user not found"
        })

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch) return res.status(400).json({
            success : false,
            message : "Invalid Password"
        })

        const token = jwt.sign({
            id : user._id,
            role : user.role,
        },process.env.JWT_SECRET)

        return res.status(200).json({
            success : true,
            token : token,
            user : user
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}
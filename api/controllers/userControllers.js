import User from "../models/user_model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs";
import Listing from "../models/Listing_Model.js";

export const test=(req,res)=>{
    res.json({
        message:"Hello World!"
    })
}

export const updateUser=async(req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only access your own account!"))
    try {
        if(req.body.password){
            req.body.password= bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser= await User.findByIdAndUpdate(req.params.id,
            {
                $set:{
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    avatar: req.body.avatar,
                }
            }, {new:true}
        )
        const{password, ...rest}=updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser= async(req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only access your own account!"))
    try {
        await User.findByIdAndDelete(req.user.id)
        res.clearCookie('access_token_real_estate')
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

export const getUserListing=async(req, res, next)=>{
    try {
        if(req.user.id=== req.params.id){
            try {
                const listings=await Listing.find({userRef:req.params.id})
                res.status(200).json(listings)
            } catch (error) {
                next(error)
            }
        }
        else{
            return next(errorHandler(401, "you can view only your listings"))
        }
    } catch (error) {
        next(error)
    }
}

export const getUser= async(req, res, next)=>{
    try {
        const user= await User.findById(req.params.id)
        if(!user) return next(errorHandler(404, 'User not found'))
        const {password:pass, ...rest}=user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


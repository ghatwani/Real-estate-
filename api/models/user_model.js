import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    avatar:{
        type:String,
        default:"https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?fit=700,700"
    },

}, {timestamps:true})

const User= mongoose.model('User', userSchema)

export default User;
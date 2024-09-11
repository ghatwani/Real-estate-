import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user_routes.js";

dotenv.config()

//database connection
mongoose.connect(process.env.MONGO_URI).then(
    () => {
        console.log("Connected to Database")
    }
)
.catch((err)=>{
    console.log(err)
})


const app = express();

app.get('/', (req, res)=>{
    res.json({
        message:"hello"
    })
})
app.use('/api/user', userRoutes)

app.listen(3000, () => {
    console.log("Server is running on Port 3000")
})
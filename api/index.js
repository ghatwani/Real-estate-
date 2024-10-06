import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user_routes.js";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.routes.js";
import cookieParser from "cookie-parser";
import path from "path";

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

const __dirname=path.resolve()

const app = express();
app.use(express.json())
app.use(cookieParser())


app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/listing', listingRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res , next)=>{
    const statusCode = err.statusCode || 500
    const message= err.message || "Internal server error"

    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(3000, () => {
    console.log("Server is running on Port 3000")
})
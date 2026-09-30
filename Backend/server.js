import express from "express";
import 'dotenv/config'
import connectDB from "./database/db.js";
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
import cors from "cors"


const app = express()

const PORT = process.env.PORT || 3000

app.get("/",(req,resp)=>{
        resp.send("servsr start")
    })
app.use(express.json())
// Deployed frontend ko backend API call karne ki permission dein.
app.use(cors({
    // Yahan frontend project ka URL dalein, backend ka nahi.
    origin: "https://e-commercs-project-nbgp.vercel.app",
    // Agar authentication cookies use hoti hain to credentials allow karein.
    credentials: true,
  }));
  
app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)

app.listen(PORT,()=>{
    connectDB()
    console.log(PORT);
})

// app.listen(4900)
import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/ProductCart`)
        console.log("MongoDB connection successfull");
        
    } catch (error) {
        console.log("MongoDB connection failed",error);
        
    }
}

export default connectDB
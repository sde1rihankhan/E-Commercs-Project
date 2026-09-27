import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/ProductCart`)
        console.log("Done");
        
    } catch (error) {
        console.log("MongoDB connection failed",error);
        
    }
}

export default connectDB
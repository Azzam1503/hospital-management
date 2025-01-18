import mongoose from "mongoose";

export default async () => {
    try {
        // if(process.env.MONGO_URI)
        const connection = await mongoose.connect(process.env.MONGODB_URI!);
        console.log("MongoDB connected successfully");
        // console.log(connection);
    } catch (error) {
        console.log("Error white connecting to the databse", error);
    }
}
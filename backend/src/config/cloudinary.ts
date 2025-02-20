import {v2 as cloudinary}  from "cloudinary";
import fs from "fs";

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
}

export const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("error in cloudinary uploading", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default connectCloudinary;
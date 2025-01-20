import bcrypt  from 'bcrypt';
import { Request, Response } from "express";
import User from "../model/user.model";
import validator from "validator";
import jwt from "jsonwebtoken";
import { CustomRequest } from '../middleware/authUser';
import { uploadOnCloudinary } from '../config/cloudinary';

const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const {name, email, password} = req.body; 
        console.log("route hit");
        console.log(req.body);
        if(!name || !email || !password) return res.status(402).json({success:false, message: "Missing details"});

        if(!validator.isEmail(email)) return res.status(402).json({success:false, message: "Invalid details"});
        if(password.length < 8 || password.length > 16) return res.status(402).json({success:false, message: "Password is of min 8 and max 16 chars"});

        const ifExisting = await User.findOne({email});

        if(ifExisting){
            return res.status(402).json({success:false, message: "User already exist"}); 
        };

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, email, password: hashedPassword
        });

        const user_token = jwt.sign({id: newUser._id}, process.env.USER_SECRET!);

        return res.status(200).json({success: true, user_token});

    } catch (error) {
        console.log(error);
    }
};


const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
        const {email, password} = req.body;

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(402).json({success:false, message: "User not exist"}); 
        };

        const ifPasswordMatch = await bcrypt.compare(password, user.password);

        if(!ifPasswordMatch) return res.status(402).json({success:false, message: "Incorrect Password"}); 

        const user_token = jwt.sign({id: user._id}, process.env.USER_SECRET!);

        return res.status(200).json({success: true, user_token});

    } catch (error) {
        console.log(error);
        return res.status(401).json({success: false, message: "Error while login"});
    }

}

const getProfile = async (req: CustomRequest, res: Response): Promise<any> =>{
    try {
        const _id = req.userId;
        
        const user = await User.findById(_id).select(["-password", "-createdAt", "-updatedAt", "-__v"]);

        if(!user) return res.status(401).json({success:false, message: "No user found"});
        
        return res.status(200).json({success:true, user});
    } catch (error) {
        console.log("error in getProfile", error);
        return res.status(401).json({success:false, message: "No user found"});
    }
};

const updateProfile = async (req:CustomRequest, res: Response): Promise<any> =>{
    try {
        // console.log(req.file);
        console.log(req.body);
        let imageFile = req.file;
        const {name, address, gender, dob, phone} = req.body;
        if(!name || !address ||  !gender || !dob || !phone) return res.status(402).json({success:false, message: "Missing details"});
        const _id = req.userId;

        const user = await User.findById(_id);

        if(!user) return res.status(401).json({success:false, message: "No user found"});
        let image = undefined;
        if(imageFile === undefined){
            image = user.image;
        }else{
            let ifUploaded = await uploadOnCloudinary(imageFile.path);
            if(ifUploaded !== null){
                image = ifUploaded.secure_url; 

            }
        };

        await User.findByIdAndUpdate(_id,{
            name, address: JSON.parse(address), gender, dob, phone, image
        });

        return res.status(200).json({success: true, message: "User updated successfully"});

    } catch (error) {
        console.log("error in updateProfile", error);
        return res.status(401).json({success:false, message: "Error while updating user"});
    }
};

export {registerUser, loginUser, getProfile, updateProfile};
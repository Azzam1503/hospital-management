import Doctor from "../model/doctor.model";
import validator from "validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../config/cloudinary";
import jwt from "jsonwebtoken";

const addDoctor = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
        const {name, email, password, speciality, degree, experience, about, fee, address, available} = req.body;
        const imageFile = req.file;
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fee || !address){
            return res.status(400).json({success:false, messgae: "All fileds are required"});
        };

        if(!validator.isEmail(email)){
            return res.json({success: false, messgae: "Please enter a valid email"});
        };

        if(password.length<8){
            return res.json({success:false, messgae: "Please enter a strong password"});
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imageUrl : any = "https://t4.ftcdn.net/jpg/00/97/00/09/360_F_97000908_wwH2goIihwrMoeV9QF3BW6HtpsVFaNVM.jpg";
        if(imageFile !== undefined){
            let ifUploaded = await uploadOnCloudinary(imageFile.path);
            if(ifUploaded !== null) imageUrl = ifUploaded.secure_url;
            console.log(ifUploaded);
        };


        const newDoctor = await Doctor.create({
            name, email, image: imageUrl, password: hashedPassword, address: JSON.parse(address), degree, fee, about, experience, speciality, date: Date.now(), available
        });

        return res.json(newDoctor);

    } catch (error) {
        console.log(error);
        return res.json({success: false})
    }
};


const loginAdmin = async (req: Request, res: Response) : Promise<any> => {
    try {
        console.log("Admin login route hit");
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email + password, process.env.ADMIN_SECRET!);
            return res.json({success: true, token});
        }else{
            res.json({success: false, messgae: "Invalid Credentials"});
        }
    } catch (error) {
        console.log("Error in admin login", error);
        return res.json({success:false, messgae: "Error while logging in admin"});
    }
}

export {addDoctor, loginAdmin};
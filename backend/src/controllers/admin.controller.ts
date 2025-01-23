import { CustomRequest } from './../middleware/authUser';
import Doctor from "../model/doctor.model";
import validator from "validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../config/cloudinary";
import jwt from "jsonwebtoken";
import Appointment from '../model/appointment.model';
import User from '../model/user.model';

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

        return res.status(200).json({
           success:true, newDoctor});

    } catch (error) {
        console.log(error);
        return res.json({success: false})
    }
};


const loginAdmin = async (req: Request, res: Response) : Promise<any> => {
    try {
        console.log("Admin login route hit");
        const {email, password} = req.body;
        console.log(req.body);
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email + password, process.env.ADMIN_SECRET!);
            return res.json({success: true, token});
        }else{
            console.log("I am here");
            res.status(401).json({success: false, message: "Invalid Credentials"});
        }
    } catch (error) {
        console.log("Error in admin login", error);
        return res.json({success:false, message: "Error while logging in admin"});
    }
}

const allDoctors = async (req: Request, res: Response): Promise<any> => {
    try {
        const doctors = await Doctor.find({}).select("-password");
        return res.status(200).json({success: true, doctors})
    } catch (error) {
        console.log("Error in all doctors", error);
        return res.status(500).json({success:false, message: "Error while getting doctors"});
    }
};

const appointmentsAdmin = async (req: CustomRequest, res : Response): Promise<any> =>{
    try {
        const appointments = await Appointment.find({});
        res.status(200).json({success:true, appointments});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Error while getting appointments"});
    }
};

const cancelAppointment = async (req: Request, res: Response) : Promise<any> => {
    try {
        const {id} = req.body;

        const appointmentData = await Appointment.findById(id);

        await Appointment.findByIdAndUpdate(id,{
            cancelled: true
        });

        const {docId, slotDate, slotTime} = appointmentData;

        const doctorData = await Doctor.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter((e: string) => e !== slotTime);

        await Doctor.findByIdAndUpdate(docId, {slots_booked});
        return res.status(200).json({success: true, message: "Appointment cancelled successfully"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({success: false, message: "Error while cancelling appointment"});
    }
};


const adminDashboardData = async (req:Request, res: Response): Promise<any> => {
    try {
        const doctors = await Doctor.find({});
        const users = await User.find({});
        const appointments = await Appointment.find({});

        const data = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointmets: appointments.reverse().slice(0,10)
        };

        return res.status(200).json({success: true, data});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Error while getting details"})
    }
};

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, cancelAppointment, adminDashboardData};
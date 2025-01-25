import  jwt  from 'jsonwebtoken';
import  bcrypt  from 'bcrypt';
import { Request, Response } from "express";
import Doctor from "../model/doctor.model";
import { CustomDoctorRequest } from '../middleware/doctorAuth';
import Appointment from '../model/appointment.model';

const chageAvailability = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
        const {docId} = req.body;
        
        const docData = await Doctor.findById(docId);
        await Doctor.findByIdAndUpdate(docId, {
            available: !docData.available
        });

        return res.status(200).json({success: true, message: "Availability changed"});
    } catch (error) {
        console.log("error in availability chage", error);
        return res.status(402).json({success: false, message: "Error while updating availability"});
    }
};

const doctorList = async (req: Request, res: Response): Promise<any> =>{
    try {
        const doctors = await Doctor.find({}).select(["-password", "-email", "-createdAt"]);
        return res.json({success: true, doctors});
    } catch (error) {
        console.log("erron in doctor list", error);
        res.status(400).json({success: false, error});
    }
};

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
        const {email, password} = req.body;
        const doctor = await Doctor.findOne({email});
        if(!doctor) return res.status(500).json({sucess:false, message: "No doctor found"});

        const ifPasswordMatch = await bcrypt.compare(password, doctor.password);
        console.log(ifPasswordMatch);
        if(!ifPasswordMatch) return res.status(401).json({sucess:false, message: "Incorrect Password"});

        const token = jwt.sign({id: doctor._id}, process.env.DOCTOR_SECRET!);

        return res.status(200).json({success:true, message: "Logged in successfully", token});
    } catch (error) {
        console.log("error in the login doctor", error);
        return res.status(500).json({success: false, message: "Error while login"});
    }
}

const appointmentDoctor = async (req: CustomDoctorRequest, res: Response): Promise<any> =>{
    try {
        const docId = req.docId;
        const appointments = await Appointment.find({docId});
        return res.json(appointments);
    } catch (error) {
        console.log(error);
    }
}

export {chageAvailability, doctorList, login, appointmentDoctor};
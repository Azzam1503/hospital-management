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
        return res.status(200).json({success:true, appointments});
    } catch (error) {
        console.log(error);
    }
}

const appointmentComplete = async (req: CustomDoctorRequest, res: Response): Promise<any> => {
    try {
        const {appointmentId} = req.body;
        const docId = req.docId;

        const appointment = await Appointment.findById(appointmentId);
        if(!appointment) return res.status(500).json({success:false, message: "Appointment does not exist"});  
        if(appointment.docId !== docId) return res.status(401).json({success:false, message: "Unauthorized"});  

        if(appointment.isCompleted) return res.status(500).json({success:false, message: "Already Completed"});  

        appointment.isCompleted = true;
        await appointment.save();

        return res.status(200).json({success:true, message: "Appointment Completed Successfully"})
    } catch (error) {
        return res.status(500).json({success:false, message: "Error while completing appointment"}); 
    }
};

const appointmentCancel = async (req: CustomDoctorRequest, res: Response): Promise<any> => {
    try {
        const {appointmentId} = req.body;
        const docId = req.docId;

        const appointment = await Appointment.findById(appointmentId);
        if(!appointment) return res.status(500).json({success:false, message: "Appointment does not exist"});  
        if(appointment.docId !== docId) return res.status(401).json({success:false, message: "Unauthorized"});  

        if(appointment.cancelled) return res.status(500).json({success:false, message: "Already Cancelled"});  

        appointment.cancelled = true;
        await appointment.save();

        return res.status(200).json({success:true, message: "Appointment Cancelled Successfully"})
    } catch (error) {
        return res.status(500).json({success:false, message: "Error while cancelling appointment"}); 
    }
};

const doctorDashboard = async (req: CustomDoctorRequest, res: Response) : Promise<any> =>{
    try {
        const docId = req.docId;

        const appointments = await Appointment.find({docId});
       
        const earnings = appointments.reduce((acc, item) => item.isCompleted ? acc += item.amount : acc + 0,0);

        const patients = appointments.reduce((acc, item) =>{
            if(!acc.includes(item.userId)){
                acc.push(item.userId);
            };

            return acc;
        },[]);

        const dashboardData = {
            earnings, patients: patients.length, appointments: appointments.length,
            latestAppointments: appointments.reverse().slice(0,5)
        };

        return res.status(200).json({success:true, message: "Data fetched successfully", dashboardData})
    } catch (error) {
        console.log("error in doctor dashboard data controller", error);
        return res.status(500).json({success:false, message: "Error while getting data"});
    }
}; 

const doctorProfile = async (req : CustomDoctorRequest, res: Response): Promise<any> => {
    try {
        const docId = req.docId;
        const doctor = await Doctor.findById(docId).select(["-password", "-createdAt", "-updatedAt", "-__v"]);
        return res.status(200).json({success: true, doctor});
    } catch (error) {
        console.log("error in doctor profile controller", error);
        return res.status(500).json({success:false, message: "Error while getting data"});
    }
};

const doctorProfileUpdate = async (req: CustomDoctorRequest, res: Response) : Promise<any> =>{
    try {
        const docId = req.docId;
        const {fee, address, available} = req.body;

        await Doctor.findByIdAndUpdate(docId, {fee, address, available});
        return res.status(200).json({success: true, message: "Updated Successfully"}); 
    } catch (error) {
        console.log("error in doctor profile update controller", error);
        return res.status(500).json({success:false, message: "Error while updating data"});
    }
}

export {chageAvailability, doctorList, login, appointmentDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, doctorProfileUpdate};
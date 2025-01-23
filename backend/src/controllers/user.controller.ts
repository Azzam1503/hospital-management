import bcrypt  from 'bcrypt';
import { Request, Response } from "express";
import User from "../model/user.model";
import validator from "validator";
import jwt from "jsonwebtoken";
import { CustomRequest } from '../middleware/authUser';
import { uploadOnCloudinary } from '../config/cloudinary';
import Doctor from '../model/doctor.model';
import Appointment from '../model/appointment.model';
import razorpay from 'razorpay';

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

const bookAppointment = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const {docId, slotDate, slotTime} = req.body;
        const userId = req.userId;
        const doctorDetails = await Doctor.findById(docId).select("-password");

        if(!doctorDetails.available){
            return res.status(400).json({success:false, message: "Doctor not Available"});
        };

        let slots_booked = doctorDetails.slots_booked;

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.status(400).json({success:false, message: "Slot not Available"});
            }else{
                slots_booked[slotDate].push(slotTime);
            }
        }else{
            slots_booked[slotDate] =[];
            slots_booked[slotDate].push(slotTime);
        };


        const userData = await User.findById(userId).select("-password");

        delete doctorDetails.slots_booked;

        const appointment = await Appointment.create({
            userId,
            docId,
            userData,
            docData: doctorDetails,
            amount: doctorDetails.fee,
            slotTime,
            slotDate,
            date: Date.now()
        });

        console.log(appointment);
        await Doctor.findByIdAndUpdate(docId, {slots_booked});
        return res.status(200).json({scuess: true, message: "Appointment booked successfully"});
    } catch (error) {
        console.log("error in book appointment", error);
        res.status(501).json({success:false, error})
    }
};

const listAppointment = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const userId = req.userId;
        console.log("route hit");
        console.log(req.userId);
        const appointments = await Appointment.find({userId});

        return res.status(200).json({sccuess: true, appointments});
    } catch (error) {
        console.log("Error in the list appointment", listAppointment);
        return res.status(401).json({success:false, message: "Error while fetching appointments"});
    }
};

const cancelAppointment = async (req:CustomRequest, res: Response): Promise<any> => {
    try {
        const {appointmentId} = req.body;
        const userId = req.userId;
        console.log(appointmentId, "----", userId);
        const appointmentData = await Appointment.findById(appointmentId);
        console.log(appointmentData);
        if(!appointmentData){
            return res.status(401).json({success:false, message: "No appointment found"});
        }

        if(appointmentData.userId !== userId) return res.status(401).json({success:false, message: "Error while cancelling appointment"});

        await Appointment.findByIdAndUpdate(appointmentId, {
            cancelled: true
        })
        const {docId, slotDate, slotTime} = appointmentData;
        
        const doctorData = await Doctor.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter((e: string) => e !== slotTime);
        
        doctorData.slots_booked = slots_booked;

        await Doctor.findByIdAndUpdate(docId, {
            slots_booked
        });

        return res.status(200).json({success: true, message: "Appointment cancelled successfully"});

    } catch (error) {
        console.log("Error in the cancel appointment", error);
        return res.status(500).json({success:false, message: "Error while cancelling appointment"});
    }
};

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const {appointmentId} = req.body;

        const appointmentdata = await Appointment.findById(appointmentId);

        if(!appointmentdata || appointmentdata.cancelled) return res.status(500).json({success:false, message: "Appointment cancelled or not found"});

        const options = {
            amount: appointmentdata.amount * 100,
            currency: "INR",
            receipt: appointmentId
        };


        //order creation

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({success: true, order});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Error while creating order"});
        
    }
};


const verifyRazorpay = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const {details} = req.body;
        console.log(details);
        const orderInfo = await razorpayInstance.orders.fetch(details.razorpay_order_id);

        if(orderInfo.status === "paid"){
            await Appointment.findByIdAndUpdate(orderInfo.receipt, {payment: true});
            return res.status(200).json({success: true, message: "Payment Successful"});
        }
        
        return res.status(500).json({success: false, message: "Payment not done"});


        console.log(orderInfo);
    } catch (error) {
        console.log(error);
    }
};

export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay};
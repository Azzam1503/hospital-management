import { Request, Response } from "express";
import Doctor from "../model/doctor.model";

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
}

export {chageAvailability, doctorList};
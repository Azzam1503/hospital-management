import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomDoctorRequest extends Request {
    docId? : string
};

const authDoctor = async (req: CustomDoctorRequest, res: Response, next: NextFunction): Promise<any> =>{
    try {
        const {token} = req.headers;
        if(!token) return res.status(401).json({success:false, message: "No Token found"});

        const token_decode = jwt.verify(token as string, process.env.DOCTOR_SECRET!);

        if(!token_decode) return res.status(401).json({success:false, message: "Invalid Token"});

        console.log(token_decode);

        req.docId = (token_decode as JwtPayload).id;

        next();

    } catch (error) {
        console.log("error in the authDoctor", error);
        return res.status(500).json({success:false, message: "Authentication Failed"})
    }
}

export default authDoctor;
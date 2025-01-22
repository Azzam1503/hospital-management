import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request{
    userId?: string;
};

const authUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user_token : any = req.headers.user_token;
        console.log("user_token-------", user_token);
        if(!user_token) return res.status(401).json({success: false, message: "No token found"});
        const decoded = jwt.verify(user_token, process.env.USER_SECRET!);

        if(!decoded) return res.status(401).json({success: false, message: "Invalid Token"});
        console.log("decoded", decoded);
        req.userId = (decoded as JwtPayload).id;
        next();
    } catch (error) {
        console.log("error in the auth middleware",error);
        return res.status(401).json({success:false, message: "user is not logged in"});
    }
}

export default authUser;
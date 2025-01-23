import {Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken"; 

const authAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const {token} = req.headers as any;
        if(!token){
            return res.json({success: false, messgae: "not authorized"});
        };
        console.log(token);
        const token_decode = jwt.verify(token, process.env.ADMIN_SECRET!);
        console.log(token_decode);
        if(!token_decode){
            return res.json({success:false, message: "Invalid token"});
        };


        next();
    } catch (error) {
        console.log("error in the authAdmin middlware", error);
        return res.json({success:false, message: "There's something wrong"});
    }
};

export default authAdmin;
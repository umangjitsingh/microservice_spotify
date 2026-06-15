import jwt from 'jsonwebtoken'
import type {Request,Response} from "express";
import type {NextFunction} from "express";
import User, {type IUser} from "./models/user.model.js";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export interface JwtUserPayload extends jwt.JwtPayload {
    id: string;
}


export const AuthM= async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const token = req.cookies.token;
    console.log("Token:", token)
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUserPayload;

        console.log("Decoded ID:", decoded)
        const user=await User.findById({_id:decoded.id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

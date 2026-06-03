import { Request,Response,NextFunction } from "express"
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware =(req:AuthRequest,res:Response,next:NextFunction) =>{
    try {
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        )
        req.user = decoded;

        next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }
}
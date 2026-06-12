import { NextFunction, Response } from "express"
import { AuthRequest } from "./auth.middleware"


export const roleMiddleware =(...roles:string[]) =>{
    return(
        req:AuthRequest,
        res:Response,
        next:NextFunction
    ) => {
        const userRole = req.user.role;

        if(!roles.includes(userRole)){
            return res.status(403).json({
                success:false,
                message:"User is Forbidden"
            })
        }

        next()
    }
}
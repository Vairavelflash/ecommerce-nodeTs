import { loginService, registerService } from "./auth.service";
import { Request,Response } from "express";


export const registerController = async (req:Request,res:Response) =>{
    const {name,email,password,role} = req.body;
    const result = await registerService(name,email,password,role);

    res.cookie("accessToken",result.accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:7*24*60*60*1000
    });

    res.status(201).json({
        success: true,
        message:"User register successfully",
        user:result.user //result obj
    })
}

export const loginController = async (req:Request,res:Response) =>{
    const {email,password} = req.body;
    const result = await loginService(email,password);

    res.cookie("accessToken",result.accessToken,{
        httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
    })
      res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success:true,
    message:"Login Successful",
    user: result.user
  })
}

export const logoutController = (
  _req: Request,
  res: Response
) => {
  res.clearCookie("accessToken");

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
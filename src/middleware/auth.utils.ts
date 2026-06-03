import jwt  from "jsonwebtoken";

type TokenPayload={
    id:string,
    role: string
}

export const generateAccessToken = (payload:TokenPayload) =>{
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}

export const generateRefreshToken = (payload:TokenPayload) =>{
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        }
    )
}
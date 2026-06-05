import { Role } from "../../../generated/prisma";
import { generateAccessToken, generateRefreshToken } from "../../middleware/auth.utils";
import { createUser, findUserByEmail } from "./auth.repository"
import bcrypt from 'bcrypt'


export const registerService = async(name:string,email:string,password:string,role:Role) =>{
    const existingUser = await findUserByEmail(email);

    if(existingUser){
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await createUser(
        name,email,hashedPassword,role
    )

    const payload={
        id:user.id,
        role:user.role,

    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return{
        user,
        accessToken,
        refreshToken
    }
}


export const loginService = async (
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};


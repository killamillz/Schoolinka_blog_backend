import { NextFunction, Response } from "express"
import  jwt, { JwtPayload }  from "jsonwebtoken"
import dotenv from 'dotenv'
import User, { IUSER } from "../models/user"
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
// import Company from "../model/company"
dotenv.config()

const OTP_LENGTH = 4;
const OTP_CONFIG = { lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false };

export const auth = async(req:JwtPayload, res:Response, next:NextFunction) => {
    try{
        const authorization = req.headers.authorization

        if(!authorization){
            return res.status(401).json({
                message: "Kindly signin"
            })
        }

        const token = authorization.slice(7, authorization.length)
        let verified:any = jwt.verify(token, process.env.APP_SECRET!)

        if(!verified){
            return res.status(401).json({
                message: "unauthorised"
            })
        }

        const user_id = verified.id

        const user = await User.findOne({where: {id:user_id}})as unknown as IUSER;

        if(!user){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        req.user = verified 
        next()
     
    }catch(err){
        return res.status(401).json({
            message: "unauthorised",
        })
    }
}


export const generateOTP = () => {
     const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
     return OTP;
   }
   
   export const tokenGenerator = (data:any)=>{
     const token = jwt.sign(data, process.env.APP_SECRET!, {expiresIn: '1d'})
     return token
   }
   
   export const verifyToken = (token:any)=>{
      const decoded = jwt.verify(token, process.env.APP_SECRET!)
      return decoded
   }

   export const hashedPassword = async (password: string) => {
     const saltRounds = 10;
     return await bcrypt.hash(password, saltRounds);
   };

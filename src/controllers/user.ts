import express, { Request, Response, NextFunction } from "express";
import User,{ IUSER } from "../models/user";
import { v4 } from "uuid";
import { generateOTP, hashedPassword } from "../utils/auth";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

dotenv.config();


export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const { firstName, lastName, email, password } = req.body;
          const existingUser = await User.findOne({ where: { email: email } });
          if (existingUser){
               return res.status(400).json({ message: "Account already exists. Kindly login." });
          }else {
               const hashPassword: string = await hashedPassword(password);
               const OTP = generateOTP();

               const newUser = await User.create({
                    id: v4(),
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    otp: OTP,
                    token: "",
                    verify: false
               })
               const user = (await User.findOne({
                    where: { email },
                  })) as unknown as IUSER;

               const token = jwt.sign(
               { email: user.email, id: user.id },
               process.env.APP_SECRET!,
               {
                    expiresIn: "1d",
               }
               );

               return res.status(200).json({
                    message: `Account is created successfully`,
                    data: newUser,
                    user_token: token,
                  });
          }
     } catch (error) {
          console.error("Error creating user:", error);
          return res.status(500).json({ error: "Internal server error" });
     }

}

export const userVerify = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const token: any = req.headers.authorization;
          const token_info = token.split(" ")[1];
          const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

          if (decodedToken) {
               const user_id = decodedToken.id;
         
               const { otp } = req.body;
         
               const user = (await User.findOne({
                 where: { id: user_id },
               })) as unknown as IUSER;


               if (!user) {
                 return res.status(400).json({ error: "User not found" });
               } else {
                 if (user.otp !== otp) {
                   return res.status(400).json({ message: "Invalid OTP" });
                 } else {
                   await User.update(
                     {
                       verify: true,
                     },
                     {
                       where: { id: user_id },
                     }
                   );
         
                   return res.status(200).json({
                     msg: "User verified",
                   });
                 }
               }
             } else {
               return res.status(400).json({
                 message: `You are not an AUTHENTICATED USER`,
               });
             }
          
     } catch (error) {
          console.error("Error verifying user:", error);
          return res.status(500).json({
            Error: "Internal Server Error",
          });
     }


}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {

     try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email } }) as unknown as IUSER;


          console.log("user", user)
          if(!user){
               res.status(401).json({
                    message: `User with email ${email} does not exist`
               })
          } else  if(user && user.verify === true){
               const validate = await bcrypt.compare(password, user.password);

               if(validate){
                    const token = jwt.sign(
                         { email: user.email, id: user.id },
                         process.env.APP_SECRET!,
                         { expiresIn: "1d" }
                       );
             
                       return res.status(200).json({
                         message: `Login successfully`,
                         id: user.id,
                         firstName: user.firstName,
                         lastName: user.lastName,
                         email: user.email,
                         user_token: token,
                         verify: user.verify,
                       });

               }else{
                    res.status(400).json({
                         message: `Incorrect password please try again`
                    })
               }

          }else if(user && user.verify === false){
               res.status(400).json({
                    message: `User not verified`
               })
          }

     } catch (error) {
          console.error("Error verifyinguser:", error);
          res.status(500).json({
               message: `Internal server error`
          })
     }
}

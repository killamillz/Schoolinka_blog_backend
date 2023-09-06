import { DataTypes, Model } from "sequelize";
import { db } from "../config"



export type IUSER = {
     id:string,
     firstName:string,
     lastName:string,
     email:string,
     password:string,
     otp:string,
     token:string,
     verify:boolean
}

class User extends Model<IUSER>{
     email: any
     id: any
     otp: any
}


User.init({
     id:{
         type:DataTypes.UUID,
         primaryKey:true,
         allowNull:false
     },
     firstName:{
         type:DataTypes.STRING,
         allowNull:false
     },
     lastName:{
         type:DataTypes.STRING,
         allowNull:false
     },
     email:{
         type:DataTypes.STRING,
         allowNull:false
     },
     password:{
         type:DataTypes.STRING,
         allowNull:false
     },
    otp:{
         type:DataTypes.STRING,
         allowNull:true
    },
    token:{
         type:DataTypes.STRING,
         allowNull:true
         },
     verify:{
          type:DataTypes.STRING,
         allowNull:false
     }
     },
          {
          sequelize:db,
          tableName:"User",
          modelName:"User"
})

export default User

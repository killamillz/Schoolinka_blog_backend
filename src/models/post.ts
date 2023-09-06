import { DataTypes, Model } from "sequelize";
import { db } from "../config"



export type IPOST = {
     id:string,
     title:string,
     description:string,
}

class Post extends Model<IPOST>{
     email: any
     id: any
     otp: any
}


Post.init({
     id:{
         type:DataTypes.UUID,
         primaryKey:true,
         allowNull:false
     },
     title:{
         type:DataTypes.STRING,
         allowNull:false
     },
     description:{
         type:DataTypes.STRING,
         allowNull:false
     }
},
     {
     sequelize:db,
     tableName:"User",
     modelName:"User"
})

export default Post

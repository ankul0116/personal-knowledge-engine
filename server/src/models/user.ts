import { Schema, model } from "mongoose";
const userSchema = new Schema({ 
  name:{type :String, required : true,minLength : 3,trim : true },
  email : {type : String,required : true , unique : true, trim : true,lowercase : true},
  passwordHash : {type : String,required: true,select: false}
 },{ timestamps: true } 
)
const User =model("User",userSchema);

export default User;
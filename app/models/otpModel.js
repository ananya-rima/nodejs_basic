const mongoose=require("mongoose");

const otpModel= new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,default:Date.now,expires:'15m'}
});



const OtpModel=mongoose.model("Otp",otpModel);
module.exports=OtpModel;
const transporter=require("../config/emailConfig")
const OtpModel=require("../models/otpModel")
const sendEmail=async(req,user)=>{
    //generate a 4 digit otp number
    const otp=Math.floor(1000+ Math.random()*9000);
    //save otp in database

    const saveOtp=await new OtpModel({userId: user._id, otp: otp}).save();
    console.log('saveOtp',saveOtp);

    
    await transporter.sendMail({
        from:process.env.EMAIL_FROM,
        to: user.email ,
        subject:"OTP-Verify your account" ,
        text:"",
        html:`<p>Dear ${user.name},</p><p>Thank you for signing up with our website.To complete your registration,please verify your <h2 style="text-align:center; background-color:#a61616ff;padding:10px;">OTP: ${otp}</h2>
        
        <p>This Otp is valid for 15 minutes.If you didn't request this OTP,Please ignore this email.</p>`

    })
    return otp
}
module.exports=sendEmail

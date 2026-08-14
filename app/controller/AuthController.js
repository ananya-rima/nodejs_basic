const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { estimatedDocumentCount } = require("../models/otpModel");
const sendEmail = require("../utils/sendEmail");
const { equal } = require("joi");
const OtpModel = require("../models/otpModel");
const  transporter  = require("../config/emailConfig")

class AuthController {
  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          status: "false",
          message: "All fields are required",
        });
      }

      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({
          status: "false",
          message: "User already exists",
        });
      }

      const salt = await bcryptjs.genSalt(10);

      const hashPassword = await bcryptjs.hash(password, salt);

      const userData = new User({
        name,
        email,
        phone,
        password: hashPassword,
      });

      const user = await userData.save();

      //Send Otp email
      await sendEmail(req, user);

      return res.status(200).json({
        status: true,
        message:
          "User registered Successfully and Otp sent to your email for verification",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "something went wrong",
        error: error,
      });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res
          .status(400)
          .json({ status: false, message: "All fields are required" });
      }
      const existingUser = await User.findOne({ email });

      //check email doesn't exist

      if (!existingUser) {
        return res.status(404).json({
          status: false,
          message: "Email doesn't exist ",
        });
      }
      //check email is  already verified
      if (existingUser.isverified) {
        return res.status(400).json({
          status: false,
          message: "Email is already verified",
        });
      }
      //checking if there is a matching email verification otp
      const emailVerification = await OtpModel.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.isverified) {
          await sendEmail(req, existingUser);
          return res.status(400).json({
            status: false,
            message: "Invalid Otp,new Otp send to your email",
          });
        }

        return res.status(400).json({
          status: false,
          message: "Invalid Otp",
        });
      }
      //check if otp has expired
      const currentTime = new Date();
      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000,
      );
      if (currentTime > expirationTime) {
        await sendEmail(req, existingUser);
        return res.status(400).json({
          status: "failed",
          message: "Otp Expired..New Otp sent to your email ",
        });
      }
      //Otp is valid and not expired,mark email as verified
      existingUser.isverified = true;
      await existingUser.save();

      //delete email verification document
      await OtpModel.deleteMany({
        userId: existingUser._id,
      });
      return res.status(200).json({
        status: true,
        message: "Email verified succesfully ",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Unable to verify email,Please try again later",
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        status: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcryptjs.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid Credentials",
      });
    }

    if (userExist.isverified == false) {
      return res.status(400).json({
        status: false,
        message: "User is not verified",
      });
    }

    const token = await jwt.sign(
      {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        role: userExist.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      status: true,
      message: "Login Successfully",
      token: token,
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        role: userExist.role,
      },
    });
  }

  async resetPasswordLink(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email field is required",
        });
      }
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Email doesn't exist",
        });
      }
      //generate token for password reset
      const secret = user._id + process.env.JWT_SECRET;
      const tokenLink = jwt.sign(
        {
          userID: user._id,
        },
        secret,
        { expiresIn: "20m" },
      );
      // Reset Link and this link generated by frontend developer
      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${tokenLink}`;
      console.log(resetLink);
      //send password reset email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p> Hello ${user.name},</p> <p>Please <a href="${resetLink}"> Click here </a> to reset your password.</p>`,
      });
      //Send success  response

      res.status(200).json({
        status: true,
        message:
          "Password reset link sent to your email.Please check your email",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status:false,
        message:"unable to send password reset email.Please try again later"
      })
    }
  }

  async resetPassword(req, res){
  
    try{
      const {password,confirm_password}=req.body;
      const {id,token}=req.params;
      const user= await User.findById(id);
      if(!user){
        return res.status(400).json({
          status:false,
          message:"user not found"
        })
      }
      //validate token check
      const new_secret=user._id+process.env.JWT_SECRET;
      jwt.verify(token,new_secret);
      if(!password|| !confirm_password){
        return res.status(400).json({
          status:false,
          message:"New password and Confirm New Password are required"
        })
      }

      if(password!== confirm_password){
        return res.status(400).json({
          status:false,
          message:"password and confirm password doesn't match"
        })
      }
      //generate hash and  salt new password

      const salt = await bcryptjs.genSalt(10);
      const newsHashPassword=await bcryptjs.hash(password,salt)
      //update user's password
      await User.findByIdAndUpdate(user._id,{$set:{ password: newsHashPassword}});

      //send success response
      res.status(200).json({status:"success",message:"Password reset successfully"})

    }catch(error){
      console.log(error)
      return res.status(500).json({
        status:"failed",
        message:"Unable to reset password.Please try again later."
      })
    }

  }
  async dashboard(req, res) {
    return res.status(200).json({
      status: true,
      message: "dashboard",
      user: req.user,
    });
  }

  async updateProfile(req, res) {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const userExist = await User.findById(req.user.id);
      if (!userExist) {
        return res.status(400).json({
          status: false,
          message: "user doesnot exist",
        });
      }

      userExist.name = name;
      userExist.email = email;
      userExist.phone = phone;
      userExist.password = userExist.password;

      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(userExist.password, salt);

      const data = await userExist.save();
      return res.status(200).json({
        status: true,
        message: "Profile updated Successfully",
        data: data,
      });
    } catch (err) {
      return res.status(500).json({});
    }
  }
}

module.exports = new AuthController();

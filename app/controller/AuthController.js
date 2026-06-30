const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

      const data = await userData.save();

      return res.status(200).json({
        status: true,
        message: "User registered Successfully",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "something went wrong",
        error: error,
      });
    }
  }

  async login(req, res) {
    console.log("LOGIN API HIT");

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
        message: "user does not exist",
      });
    }

    const isMatch = await bcryptjs.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid Credentials",
      });
    }
   


    const token = await  jwt.sign(
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
      user:{
       id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
        role: userExist.role,
      }
    });
  }

  async dashboard(req,res){
    return res.status(200).json({
      status:true,
      message:"dashboard",
      user:req.user
    });
  }

  async updateProfile(req,res){
    try{
  const {name,email,phone} =req.body;
   if(!name || !email || !phone){
    return res.status(400).json({
      status:false,
      message:"All fields are required",
    })
   }

   const  userExist= await User.findById(req.user.id);
   if(!userExist){
    return res.status(400).json({
      status:false,
      message:"user doesnot exist"
    });
   }

   userExist.name=name;
   userExist.email=email;
   userExist.phone=phone;
   userExist.password=userExist.password;

   const salt=await bcryptjs.genSalt(10);
   const hashPassword=await bcryptjs.hash(userExist.password,salt);

   const data=await userExist.save();
   return res.status(200).json({
    status:true,
    message:"Profile updated Successfully",
    data:data
   });

    }catch(err){
      return res.status(500).json({

      })

    }
  }
}

module.exports = new AuthController();

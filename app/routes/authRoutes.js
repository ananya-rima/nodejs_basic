 const express= require("express");
const AuthController = require("../controller/AuthController");
const Auth=require("../middleware/authMiddleware");

 const router=express.Router();


 router.post('/register',AuthController.register)
 router.post('/verify-otp',AuthController.verifyOtp)
 router.post('/login',AuthController.login)

 router.post('/reset-password-link',AuthController.resetPasswordLink)
 router.post('/reset-password/:id/:token',AuthController.resetPassword)
 




 router.use(Auth); //apply the auth middile ware to all routesbelow this line
 router.get('/dashboard',AuthController.dashboard)
 router.post('/updatProfile',AuthController.updateProfile)

//  router.get('/dashboard',Auth,AuthController.dashboard)
//  router.post('/updatProfile',Auth,AuthController.updateProfile)  

 
  


 module.exports=router;
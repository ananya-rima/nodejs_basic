const jwt= require("jsonwebtoken");
const adminAuthCheck=(req,res,next)=>{
 if (req.cookies && req.cookies.admintoken){
    const admintoken=req.cookies.admintoken
    const decoded=jwt.verify(admintoken,process.env.ADMIN_JWT_SECRET)
    req.admin=decoded
    next()
 }
 else{
    console.log("Not Logged In Please Login First")
    res.redirect('/admin/login')
 }
}
module.exports=adminAuthCheck
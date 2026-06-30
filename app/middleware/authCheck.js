const jwt= require("jsonwebtoken");
const AuthCheck=(req,res,next)=>{
 if (req.cookies && req.cookies.token){
    const token=req.cookies.token
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decoded
    next()
 }
 else{
    console.log("Not Logged In Please Login First")
    res.redirect('/login')
 }
}
module.exports=AuthCheck

const jwt=require('jsonwebtoken');


const Auth=(req,res,next)=>{
    const token=req.headers['authorization'];
    if(!token){
        return res.status(401).json({
            status:false,
            message:"No Token Provided"
        });
    }

    const breartoken=token.split(" ")[1];
    if(!breartoken){
        return res.status(401).json({
            status:false,
            message:"Access denied.Invalid token"
        });
    }
    try{

        const decoded=jwt.verify(breartoken,process.env.JWT_SECRET);
        req.user=decoded;

        

        next();

    }catch(err){
        return res.status(400).json({
            status:false,
            message:"Invalid token"
        })
    }
}

  module.exports=Auth;
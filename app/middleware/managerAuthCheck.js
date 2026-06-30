const jwt=require("jsonwebtoken");


const managerAuthCheck=(req,res,next)=>{


if(req.cookies && req.cookies.managertoken){


const token=req.cookies.managertoken;


const decoded=jwt.verify(
token,
process.env.MANAGER_JWT_SECRET
);



if(decoded.role==="manager"){

req.manager=decoded;

next();

}

else{

return res.redirect("/login");

}


}

else{

return res.redirect("/login");

}



}


module.exports=managerAuthCheck;
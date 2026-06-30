require('dotenv').config();
const mongoose=require('mongoose')

const ConnectDB=async()=>{
    try{
      
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        if(conn){
            console.log(`MongoDB connected: ${conn.connection.host}`);
        }
        else{
            console.log('not connected');
        }

    } catch{
        console.log("error");
    }
}
module.exports=ConnectDB;
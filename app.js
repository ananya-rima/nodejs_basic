require('dotenv').config()

const express = require("express");
const path = require('path');

const ConnectDB=require('./app/config/db')

const app = express();

const Session=require('express-session')
const cookieParser=require('cookie-parser')
const connectflash=require("connect-flash")

const helmet=require('helmet')

const limit=require('./app/utils/limit')
const morgan=require('morgan')


ConnectDB();


// middleware FIRST
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());


//helmet

app.use(helmet())
//rate-limit
app.use(limit);

//for development
app.use(morgan("dev"));

// for production
// app.use(morgan("combined"));

app.use(Session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave:false,
  saveUninitialized:false,
  cookie:{
    maxAge:1000*60*60*24
  }
}));

//for flash massage 
//connectflash use session thats why we use connect flash after session.

app.use(connectflash())

// flash message globally available for all ejs
app.use((req,res,next)=>{

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();

});



// ejs
app.set('view engine','ejs');
app.set('views','views');


// routes first
const homeRoute=require('./app/routes/homeRoutes')
app.use(homeRoute);


// static after routes
app.use(express.static('public'));

app.use('/uploads',express.static('uploads'));

const employeeRouter=require('./app/routes/employeeRoutes')
app.use('/api',employeeRouter);


const authRoute=require('./app/routes/authRoutes')
app.use('/api',authRoute);


const authEjsRoute=require('./app/routes/authEjsRoutes')
app.use(authEjsRoute);



const PORT=process.env.PORT;

app.listen(PORT,()=>{
 console.log(`server running http://localhost:${PORT}`);
});
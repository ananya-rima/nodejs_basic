const joi = require('joi');
const employeeValidation= joi.object({
    name:joi.string()
    .required().min(3),

    email:joi.string()
    .required()
    .email( ),

    phone:joi.string()
    .required()
    .min(10),

    age:joi.number()
    .required()
    .min(18)
})
module.exports=employeeValidation
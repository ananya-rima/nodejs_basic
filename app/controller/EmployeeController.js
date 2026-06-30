
const Employee=require('../models/employee')


class EmployeeController{

    async createEmployee(req,res){
        try{

            const {name,email,phone,age}=req.body;
            const employee=new Employee({
                name,
                email,
                phone,
                age,
            });
            const result=await employee.save();
            return res.status(201).json({
                status:true,
                message: "Employee created successfully",
                data:result,
            })

        }catch(error){
            console.log(error);
        }
    }


}

module.exports=new EmployeeController()
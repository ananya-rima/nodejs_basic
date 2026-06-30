const express = require("express");
const EmployeeController = require("../controller/EmployeeController");
const employeeValidation=require("../utils/employeeValidate");
const validate = require("../middleware/validate")

const router = express.Router();

router.post(
  "/create/employee",
  validate(employeeValidation),
  EmployeeController.createEmployee
);



module.exports = router;
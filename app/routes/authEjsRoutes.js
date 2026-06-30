const express = require("express");
const AuthEjsController = require("../controller/AuthEjsController");
const AuthCheck = require("../middleware/authCheck");
const adminAuthCheck = require("../middleware/adminauthcheck");
const managerAuthCheck = require("../middleware/managerAuthCheck");

const router = express.Router();

//user

router.get("/register", AuthEjsController.register);
router.post("/register/store", AuthEjsController.registerstore);
router.get("/login", AuthEjsController.login);
router.post("/login/store", AuthEjsController.loginstore);
router.get("/dashboard", AuthCheck, AuthEjsController.dashboard);
router.get("/logout", AuthEjsController.logout);

//admin

router.get("/admin/login", AuthEjsController.adminlogin);
router.post("/admin/login/store", AuthEjsController.adminloginstore);
router.get(
  "/admin/dashboard",
  adminAuthCheck,
  AuthEjsController.admindashboard,
);
router.get("/admin/logout", AuthEjsController.adminlogout);

//manager

router.get("/manager/login", AuthEjsController.managerlogin);

router.post(
  "/manager/login/store",
  (req, res, next) => {
    console.log("MANAGER ROUTE HIT");

    next();
  },
  AuthEjsController.managerloginstore,
);

router.get(
  "/manager/dashboard",
  managerAuthCheck,
  AuthEjsController.managerdashboard,
);

router.get("/manager/logout", AuthEjsController.managerlogout);

router.get("/role-login", AuthEjsController.roleLogin);

module.exports = router;

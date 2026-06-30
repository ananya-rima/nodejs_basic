const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthEjsController {
  dashboard(req, res) {
    return res.render("dashboard", {
      data: req.user,
    });
  }

  login(req, res) {
    return res.render("login");
  }

  register(req, res) {
    return res.render("register");
  }

  async registerstore(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        req.flash("error", "All Fields Are Required");

        return res.redirect("/register");
      }

      const userExist = await User.findOne({ email });

      if (userExist) {
        req.flash("error", "User already exist");

        return res.redirect("/register");
      }

      const salt = await bcryptjs.genSalt(10);

      const hashPassword = await bcryptjs.hash(password, salt);

      const userData = new User({
        name,
        email,
        phone,
        password: hashPassword,
      });

      const data = await userData.save();

      if (data) {
        req.flash("success", "Registration Successful, Please Login");
        return res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async loginstore(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash("error", "All fields are Required");
        return res.redirect("/login");
      }
      const userExist = await User.findOne({ email });
      if (!userExist) {
        req.flash("error", "User does not exist");
        return res.redirect("/login");
      }
      const isMatch = await bcryptjs.compare(password, userExist.password);
      if (!isMatch) {
        req.flash("error", "Invalid Credentials");
        return res.redirect("/login");
      }
      if (isMatch && userExist.role == "user") {
        //create token

        const token = await jwt.sign(
          {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            role: userExist.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" },
        );

        if (token) {
          res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          });

          console.log("COOKIE SET", token);
          req.flash("success", "Login Successful");

          return res.redirect("/dashboard");
        } else {
          console.log("something went wrong");
          return res.redirect("/login");
        }
      }
      console.log("Login Failed");
      return res.redirect("/login");
    } catch (err) {
      console.log(err.message);
      return res.redirect("/login");
    }
  }

  async logout(req, res) {
    res.clearCookie("token");
    return res.redirect("/");
  }

  //admin section

  adminlogin(req, res) {
    return res.render("admin/login");
  }

  adminloginstore(req, res) {}

  async adminloginstore(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        console.log("All fields are Required");
        return res.redirect("/admin/login");
      }
      const userExist = await User.findOne({ email });
      if (!userExist) {
        console.log("User Doest not Exist");
        return res.redirect("/admin/login");
      }
      const isMatch = await bcryptjs.compare(password, userExist.password);
      if (!isMatch) {
        console.log("Invalid Credentails");
        return res.redirect("/admin/login");
      }
      if (isMatch && userExist.role === "admin") {
        //create token

        const token = await jwt.sign(
          {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            role: userExist.role,
          },
          process.env.ADMIN_JWT_SECRET,
          { expiresIn: "1d" },
        );

        if (token) {
          res.cookie("admintoken", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          });

          console.log("COOKIE SET", token);
          req.flash("success", "Admin Login Successful");

          return res.redirect("/admin/dashboard");
        } else {
          console.log("something went wrong");
          return res.redirect("/admin/login");
        }
      }
      console.log("Login Failed");
      return res.redirect("/admin/login");
    } catch (err) {
      console.log(err.message);
      return res.redirect("/admin/login");
    }
  }

  admindashboard(req, res) {
    try {
      return res.render("dashboard", {
        data: req.admin,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  async adminlogout(req, res) {
    res.clearCookie("admintoken");
    res.clearCookie("token");
    return res.redirect("/");
  }

  //manager

  managerlogin(req, res) {
    return res.render("manager/login");
  }
  async managerloginstore(req, res) {
    try {
      const { email, password } = req.body;
        console.log("MANAGER LOGIN HIT");
         console.log(email,password);

      const userExist = await User.findOne({ email });

      if (!userExist) {
        return res.redirect("/manager/login");
      }

      const isMatch = await bcryptjs.compare(password, userExist.password);

      if (!isMatch) {
        return res.redirect("/manager/login");
      }

      if (userExist.role === "manager") {
        const token = jwt.sign(
          {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            role: userExist.role,
          },

          process.env.MANAGER_JWT_SECRET,

          {
            expiresIn: "1d",
          },
        );

        res.cookie("managertoken", token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        return res.redirect("/manager/dashboard");
      }

      return res.redirect("/manager/login");
    } catch (err) {
      console.log(err.message);
    }
  }
  managerdashboard(req, res) {
    return res.render("dashboard", {
      data: req.manager,
    });
  }
  managerlogout(req, res) {
    res.clearCookie("managertoken");
    res.clearCookie("token");

    return res.redirect("/");
  }

  //role
  roleLogin(req, res) {
    const role = req.query.role;

    if (role === "user") {
      return res.redirect("/login");
    }

    if (role === "admin") {
      return res.redirect("/admin/login");
    }

    if (role === "manager") {
      return res.redirect("/manager/login");
    }

    return res.redirect("/");
  }
}

module.exports = new AuthEjsController();

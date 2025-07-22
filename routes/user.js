const express =  require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/User.js");

//Signup route displsy signup
router.get("/signup" , usercontroller.signuppage);


//registr route
router.post("/signup" , wrapAsync(usercontroller.resgister));


router.get("/login" , usercontroller.loginpage
);


router.post("/login" ,   saveRedirectUrl ,   passport.authenticate("local"  , {failuerRedirect: '/login' , failureFlash: true , } ) , 
usercontroller.login);


router.get("/logout" , usercontroller.logout )
 
module.exports = router;
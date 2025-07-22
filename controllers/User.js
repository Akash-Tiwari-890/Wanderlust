const User = require("../models/user");

//route for showing signup page
module.exports.signuppage=(req,res)=>{
    res.render("users/signup.ejs");//route wich will render the siginup page from views 
}

//route for register
module.exports.resgister=async(req,res)=>{
    try{
    let {username , email , password} = req.body;
    const newUser =  new User({email , username}) //extracting the details of user 
   const reguser = await  User.register(newUser , password);//regitng the user to db registring them
    req.login(reguser , (err)=>{ //as usert eill register login() method will take that user and also callback err and diect login and take
        if(err){
            return next(err);
        }
         req.flash("sucess" , "Welcome to wanderlust");//Displaying the messge that the user  l registered
          res.redirect("/listings");
    })
    }catch(e){
        req.flash("error" , e.message);//flashig the messgeig if the user allerdy regiretd
        res.redirect("/signup"); // redirecting agin to /signup page
    }


}


//shwoing loginpage


module.exports.loginpage=(req,res)=>{
    res.render("users/login.ejs"); //  rendring the lofin page using views
}


//login

module.exports.login=async(req,res)=>{//authenticating  the user through passport,authenticate method
     
         req.flash("sucess" , "welcome to wanderlust");
        // console.log(res.session.redirectUrl)
        let redirectUrl =  res.locals.redirectUrl  || "/listings";
        res.redirect(redirectUrl);

}


module.exports.logout= (req,res,next)=>{
    req.logout((err)=>{//req.logout is a defult function wich will logout the user
        if(err){//in case any error
            return next(err);  // return it
        }
        req.flash("sucess" , "you are logged out!")//disply logged out messge
        res.redirect("/listings");
    })
}
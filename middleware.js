const Listing = require("./models/listing.js");
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path  ,  ...    req.originalUrl);
    //    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
       req.session.redirectUrl =  req.originalUrl
        console.log(req.session.redirectUrl);
        

        req.flash("error" , "you must logged in to create listings");
        return res.redirect("/login");
    }


    next();
}

module.exports.saveRedirectUrl = (req , res , next)=>{

    if(req.session.redirectUrl){
     

        
        res.locals.redirectUrl = req.session.redirectUrl;
     

        console.log(res.locals.redirectUrl);


    }
    next();
};


module.exports.isowner=async(req,res,next)=>{
       let{id} = req.params;//Extcting id from paramtr
   let listing = await  Listing.findById(id); // finding the isting fron  by id
   if(!listing.owner._id.equals(res.locals.curuser._id)){//chcking  whearher the liosting.owner.idf == curuser.id
    console.log(res.locals.curuser._id);
    req.flash("error" , "You dont have permistion to edid")//if not displaying the error messge
    return  res.redirect(`/listings/${id}`);//And redirecting towards /listings/id
   }
      next();
}





module.exports.isreviewauthor=async(req,res,next)=>{
       let{ id , reviewId} = req.params;//Extcting id from paramtr
   let review = await  Review.findById(reviewId); // finding the isting fron  by id
   if(! review.author.equals(res.locals.curuser._id)){//chcking  whearher the liosting.owner.idf == curuser.id
    req.flash("error" , "You cant delete")//if not displaying the error messge
    return  res.redirect(`/listings/${id}`);//And redirecting towards /listings/id
   }
      next();
}
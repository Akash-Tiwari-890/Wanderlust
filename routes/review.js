const express =  require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js"); //Requiring wrapAsync to handle async errors
const ExpressError = require("../utils/ExpressError.js"); //Requiring ExpressError for error handling\
const {reviewSchema } = require("../schema.js"); //Requiring listingSchema from schemas.js for validation
const Review = require("../models/review.js"); //Requiring Review From Models/Review.js
const Listing = require("../models/listing.js"); //Requireing Listing From Models/ lISTING .JS
const {isLoggedIn , isreviewauthor }=require("../middleware.js");

const validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error); //If validation fails then it will throw an error with status code 400 and the error message
    }else{
        next()      //If validation passes then it will call the next middleware
    }
};

const reviewController = require("../controllers/reviews.js")



// Rewiews Post route
router.post("/" , isLoggedIn ,   validateReview , wrapAsync(reviewController.createReview));



//delte route fro review


router.delete("/:reviewId" , isLoggedIn , isreviewauthor , wrapAsync(reviewController.deletereview));

module.exports = router;
 
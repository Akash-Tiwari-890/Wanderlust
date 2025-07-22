const Listing = require("../models/listing");

const Review = require("../models/review");



module.exports.createReview=async(req,res)=>{
   let listing =  await Listing.findById(req.params.id); //finding the perticular listing through its perticular listing
    console.log(listing);
    let newReview = new Review ( req.body.review); // adding new review obtaind from form to revie collection
    newReview.author = req.user._id;//storing the current useer id insite revivew.author
    console.log(newReview);
   
    
    await newReview.save();

    listing.reviews.push(newReview);//Pushing the new review  to listing reviews pargt
    await listing.save();//saving listing with its added review
    req.flash("sucess" , "New Review Added Sucessfully")//Storing flash message
    
    res.redirect(`/listings/${listing._id}`); 
     
     
 



}




module.exports.deletereview=async (req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull :{reviews:reviewId}});//deleting the  id of perticular listing from  listing and updating the listing
    await Review.findByIdAndDelete(reviewId);//delteing the perticulaar review
    req.flash("sucess" , "Review Deleted Sucessfully")//Storing flash message
    res.redirect(`/listings/${id}`);//redirectiing back to our show route
}
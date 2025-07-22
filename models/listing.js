const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
// const { coordinates } = require("@maptiler/sdk");

//Creating Structure of Our Listing Collections
const listingSchema = new Schema({

    title :{
        type:String,
        required: true,
    },
    description: String,
    image:{ 
      url : String,
      filename : String,
    },
    price : Number,
    location: String,
    country: String,

    reviews : [
        {
            type : Schema.Types.ObjectId, //Referencing to Review Collection
            ref : "Review",
        }
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    geometry:{
        type:{
            type: String,
            enum: ["Point"], // 'coordinates' must be a GeoJSON Point
            required: true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
  

});
 // A post midelleware which will be tigreed whenever a deletion of any listing will be performed  it will sercjh the reviewsid from rewies arry inside listing and delte
listingSchema.post("findOneAndDelete" , async (listing)=>{
    if(listing){
    await Review.deleteMany( {_id : {$in: listing.reviews}});//deleting the reviews which are matched with the perticular id inside revies of listing
    }
});

const Listing = mongoose.model("Listing" , listingSchema); //Creating Collection Listing

module.exports=Listing;  //Exporting listing

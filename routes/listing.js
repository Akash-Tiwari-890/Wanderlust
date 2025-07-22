const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 
const ExpressError = require("../utils/ExpressError.js"); //Requiring ExpressError for error handling\
const {isLoggedIn , isowner}=require("../middleware.js");//requireing the middeleware expordted by the middleware.js
const { listingSchema , reviewSchema } = require("../schema.js"); //Requiring listingSchema from schemas.js for validation

const Listing = require("../models/listing.js"); //Requireing Listing From Models/ lISTING .JS
const multer = require("multer");//requirring muklter to pardser multipart data file send by the sorm
const {storage} = require("../cloudConfig.js");//requiring the storage from cloudConfig.js
const uplooad = multer({storage}) ; //muklter will fecthc out filrs data and store it in uplods folder

const listingController = require("../controllers/listings.js");

const valdatelisting=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body); //Validating the req.body against the listingSchema
    if(error){
        throw new ExpressError(400 , error); //If validation fails then it will throw an error with status code 400 and the error message
    }else{
        next()      //If validation passes then it will call the next middleware
    }

};


router
  .route("/") 
.get(wrapAsync(listingController.index))//we have tramnsfertd he logic of rohute to controller//index route
.post(  isLoggedIn ,  uplooad.single('listing[image]')  , valdatelisting ,  wrapAsync(listingController.createListing)//create route
);



//New Route
 router.get("/new" , isLoggedIn , listingController.renderNewForm  );




router
 .route("/:id")
 .get( wrapAsync(listingController.show))//show route
 .put(  uplooad.single("listing[image]") ,    valdatelisting , isLoggedIn, isowner ,  wrapAsync(listingController.updateListing)
)//update route
.delete( isLoggedIn , isowner ,   wrapAsync(listingController.deleteListing));//delete route


//edit route
router.get("/:id/edit", isLoggedIn , isowner ,  wrapAsync (listingController.editListing));

module.exports = router;
 




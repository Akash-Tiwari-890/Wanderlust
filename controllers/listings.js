const Listing = require("../models/listing");//requiring listing

let maptilerSdkInstance = null;
async function getMapTilerSdk() {
    if (maptilerSdkInstance) {
        return maptilerSdkInstance;
    }
    try {
        const maptilerSdk = await import("@maptiler/sdk");
        maptilerSdk.config.apiKey = process.env.MAP_TOKEN; // Use your correct env var name
        maptilerSdkInstance = maptilerSdk;
        return maptilerSdk;
    } catch (error) {
        console.error("Failed to load or configure MapTiler SDK in createListing:", error);
        throw new Error("MapTiler SDK not available for geocoding.");
    }
}

//For indexroute
module.exports.index=async(_req,res)=>{
     allListings = await Listing.find({});//finding all the listing
  
     res.render("./listings/index.ejs",{allListings}); //rendering all listing
      
     

    }

//Rediring the new form for create
module.exports.renderNewForm=(req,res)=>{
     
     res.render("./listings/new.ejs");//It will render a  form from new.ejs which will take the detiols of new listing and send post request to /listings


}

//show page 

module.exports.show=async(req,res)=>{
    let {id} = req.params;                           //Extrcting the id from parametr passed by the index.ejs
    const listing = await Listing.findById(id).populate({path:"reviews" ,populate:{path:"author",} }).populate("owner");    
     if(!listing){
        req.flash("error" , "Listing not found");
        res.redirect("/listings"); //If listing is not found then it will store an error message in flash
     } //Finding details of that perticular listsing by id obtained from req.phrms
     console.log(listing);
    res.render("./listings/show.ejs",{listing});      //Rendering details of the listing form show route wich will print all the details of that perticular listing
}


// Assuming this is in routes/listing.js or controllers/listings.js

// Make sure getMapTilerSdk is defined at the top of this file as previously instructed
// For example:
// let maptilerSdkInstance = null;
// async function getMapTilerSdk() { ... } // Your working getMapTilerSdk function here

module.exports.createListing = async (req, res, next) => {
    const userProvidedLocation = req.body.listing.location; // Get location from user input
    console.log(`\n--- Attempting to geocode for New Listing: "${userProvidedLocation}" ---`);

    let geocodedPlaceName = userProvidedLocation; // Default to user input if geocoding fails
    let geometryToSave = {}; // Initialize as empty or a default point

    try {
        const maptilerSdk = await getMapTilerSdk(); // Get the SDK instance

        const response = await maptilerSdk.geocoding.forward(userProvidedLocation, {
            limit: 1 // Just get the top result
        });

        if (response.features && response.features.length > 0) {
            const firstResult = response.features[0]; // firstResult IS defined here
            
            // Extract and assign to variables that have a wider scope
            geocodedCoordinates = firstResult.geometry.coordinates; // [longitude, latitude]
            geocodedPlaceName = firstResult.place_name;             // The full, formatted address string

            // Create the GeoJSON Point object for your Mongoose schema's 'geometry' field
            geometryToSave = {
                type: "Point",
                coordinates: [geocodedCoordinates[0], geocodedCoordinates[1]] // Ensure it's [longitude, latitude]
            };

            console.log(`Geocoding Result for User Input "${userProvidedLocation}":`);
            console.log(`  Formatted Place Name: ${geocodedPlaceName}`);
            console.log(`  Coordinates: [${geocodedCoordinates[0]}, ${geocodedCoordinates[1]}]`);
            console.log("GeoJSON Geometry to Save:", geometryToSave);

        } else {
            // No geocoding results found, handle this case gracefully
            console.warn(`No geocoding results found for "${userProvidedLocation}". Proceeding without specific coordinates.`);
            req.flash("error", "Could not find precise coordinates for the provided location. Listing will be saved without map data.");
            // You might want to return here if map data is strictly required
            // return res.redirect("/listings/new"); 
        }

    } catch (error) {
        // Handle any errors that occur during geocoding
        console.error(`Error during geocoding for "${userProvidedLocation}":`, error);
        req.flash("error", `Error geocoding location: ${error.message}. Listing will be saved without map data.`);
        // Again, you might want to return here if map data is strictly required
        // return res.redirect("/listings/new");
    }

    // Now, outside the try-catch and if-else, these variables are accessible
    // They will either contain geocoded data or the default user input/empty object
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Assign the geocoded (or default) data to your newListing object
    newListing.location = geocodedPlaceName;
    newListing.geometry = geometryToSave; // Will be empty or a Point object

    let savedListing = await newListing.save(); // Save the listing
    console.log(savedListing);

    req.flash("sucess", "New Listing Created Successfully");
    res.redirect("/listings");
};

module.exports.editListing=async(req , res , next)=>{
    
     let {id} = req.params;                           //Extrcting the id from parametr passed by the  edit buttoon form show .ejs
    const listing = await Listing.findById(id);   //finding   that listing by its id  and storing igt in varible listing
    if(!listing){ //If listing is not found then it will throw an error
        next(new ExpressError(404 , "Listing not found"));//If listing is not found then it will throw an error
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/uploads/", "/upload/h_300 , w_250"); //Replace the uploads with thumbnails to get the thumbnail image url
    res.render("./listings/edit.ejs",{listing , originalImageUrl});     // rendering the edit .ejs form and passing listing varible  to edit .ejs so that it can be used their

   
}


module.exports.updateListing = async(req,res)=>{
    let{id} = req.params;//Extcting id from paramtr
    
  let  listing  =  await Listing.findByIdAndUpdate(id , {...req.body.listing}); //updating the cureent listing with the values passed by the user thorugh edit form
  if(typeof req.file !=="undefine") {
      let url = req.file.path;
      let filename= req.file.filename;
      listing.image= {url , filename};//Storing the image url and filename in the listing object
    await listing.save();//Saving the updated listing
  }
    req.flash("sucess" , "Listing Updated Sucessfully")//Storing flash message
    res.redirect(`/listings/${id}`);//rediecting to show route

}


module.exports.deleteListing = async(req,res)=>{
    let{id}=req.params; //Exctraacting  the id from the parmater 
    let deleteListing =  await Listing.findByIdAndDelete(id);//Finding the listing based on prticular id and deleteing it
    req.flash("sucess" , "Listing Deleted Sucessfully")//Storing flash message
    console.log(deleteListing);//Printing the deleted listing
    res.redirect("/listings");//Rediecting to index route af5ter delteion
}
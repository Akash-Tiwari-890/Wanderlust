if(process.env.NODE_ENV !="production"){//WHEN WE ARE AT NOT AT PRODUCTION THAN WE CAN USE ENV FILE OTHERIWISE WE WI;L NOT USE IT
    require('dotenv').config();
}//if the node env is not production then only we will load the .env file


console.log(process.env.SECRET);


const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")//requiring method-ovveride packge so to convert post req to put and delte 
const ejsMate = require("ejs-mate");//Requires ejs mate for templating
const session = require("express-session");//requiring express-session for session management
const MongoStore = require("connect-mongo"); //requiring connect-mongo to store session in mongo db
const flash = require("connect-flash");//requiring connect-flash for flash messages

const passport = require("passport");
const LocalStrategy = require("passport-local"); //requiring passport local strategy for user authentication
const User = require("./models/user.js"); //requiring user model for user authentication
const listings =  require("./routes/listing.js");//requireing the router which is exported from the router/listing.js
const reviews = require("./routes/review.js") ; //requiring the router which is exported from the  router/reviews.js
const user = require("./routes/user.js"); //requiring the router which is exported from the  router/user.js
const axios = require('axios');
const cors = require('cors'); // If you need CORS on your main app, ensure this is used
// const { required } = require('joi');

// const PYTHON_CHATBOT_URL = 'http://127.0.0.1:5000/chat'; // Check this URL against your Python app's actual running URL and endpoint
// const port= 3000;



const dburl =  process.env.ATLASDB_URL ;


main().then(()=>{
    console.log("connected to mongo db")
}).catch((err)=>{
     console.log(err);
});





async function main(){
    await mongoose.connect(dburl);
}

//setting up ejs
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use (express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.engine("ejs" , ejsMate);//Using ejs mate
app.use(express.static(path.join(__dirname , "/public")))
app.use(express.json()); // Ensure this is present for parsing JSON requests
app.use(cors());


let maptilerSdkInstance = null; // To store the SDK instance after first import

async function getMapTilerSdk() {
    if (maptilerSdkInstance) {
        return maptilerSdkInstance; // Return already initialized instance
    }
    try {
        // Dynamically import the ES Module
        const maptilerSdk = await import("@maptiler/sdk");
        // Configure with your API key from .env
        maptilerSdk.config.apiKey = process.env.MAP_TOKEN; // Ensure MAPTILER_API_KEY is in your .env file
        maptilerSdkInstance = maptilerSdk; // Store for future use
        console.log("MapTiler SDK initialized for backend use.");
        return maptilerSdk;
    } catch (error) {
        console.error("CRITICAL ERROR: Failed to load or configure MapTiler SDK:", error);
        throw new Error("MapTiler SDK not available for geocoding. Check API key and installation.");
    }
}


const store = MongoStore.create({
    mongoUrl: dburl, // Use the same MongoDB URL as above
    crypto :{
        secret: process.env.SECRET ,
       
    },
    touchAfter: 24 * 3600, // How often to update the session in the database (in seconds)
});


store.on("error" , ()=>{
    console.log("session store error" , err);
})


const sessioOption = { 
    store ,
    secret:"mysupersecretstring" ,
    resave:false ,
    saveUninitialized:true, // session id will be created and saved inside the browser in the form of cookie
    cookie:{
        expires: Date.now() + 7 *24*60*60*1000, //cookie will expire after 7 days
        maxAge: 7 *24*60*60*1000, //cookie will expire after 7 days
        httpOnly: true, // Helps prevent XSS attacks by not allowing JavaScript to access the cookie
    }
}


app.use(session(sessioOption));//using session middleware
app.use(flash()); //using flash middleware for flash messages

app.use(passport.initialize());//to initilize passport
app.use(passport.session()); //to use session in passport)
passport.use(new LocalStrategy(User.authenticate()));//all the user should be authenticated with the local stratgy and to authenticate them a User.authenticat emethod will be used

 passport.serializeUser(User.serializeUser());//Storing the informtion of user in a sessiom
 passport.deserializeUser(User.deserializeUser());//removing the user information from session

app.use((req,res,next)=>{
   res.locals.sucess = req.flash("sucess");//aceesing the values of flsh messge in locl varible
   console.log(res.locals.sucess);
   res.locals.error = req.flash("error");
   console.log(res.locals.error);
   res.locals.curuser = req.user;//since when we logiin pssport storet the user information inside the req body so makiing req.body locals
   next(); // This will pass the control
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username:"deltastudent",
//     });
//    let regUser =  await User.register(fakeUser , "hello");//Registring the user with the password  usimng user.register method
//    res.send(regUser);
// });







app.use("/listings" , listings);//this wil use the lisgting route
app.use("/listings/:id/reviews" , reviews); // this wil use the revuiew route 
app.use("/" , user); // This will use the user routes for all paths starting with '/'
// index.js (at the very bottom, before app.listen)

// --- Start of Independent Geocoding Test (NOT A ROUTE) ---
// (async () => { // This is an async Immediately Invoked Function Expression (IIFE)
//     // FIX 1: 'Lucknow' must be a string. Removed the || default as it's for query parameters.
//     const myLocation = "Lucknow"; // <--- This is now a string literal for the location you want to test
//     // You can change "Lucknow" to any address you want to test directly.

//     console.log(`\n--- Independent Geocoding Test for "${myLocation}" ---`);

//     try {
//         const maptilerSdk = await getMapTilerSdk(); // Get the SDK instance

//         const response = await maptilerSdk.geocoding.forward(myLocation, {
//             limit: 1 // Just get the top result
//         });

//         if (response.features && response.features.length > 0) {
//             const firstResult = response.features[0];

//             // Here are your variables:
//             const geocodedCoordinates = firstResult.geometry.coordinates; // [longitude, latitude]
//             const geocodedPlaceName = firstResult.place_name;

//             console.log(`Geocoding Result for "${myLocation}":`);
//             console.log(`  Variable 'geocodedPlaceName': ${geocodedPlaceName}`);
//             console.log(`  Variable 'geocodedCoordinates': [${geocodedCoordinates[0]}, ${geocodedCoordinates[1]}]`);
//             console.log("Full Geocoding Result Object:", firstResult.geometry); // Printing just the geometry part as you requested before


//             // *** REMOVED ALL res.json(), res.status() calls here ***
//             // These methods only work inside an Express route handler.

//         } else {
//             console.warn(`No geocoding results found for "${myLocation}".`);
//         }
//     } catch (error) {
//         console.error(`Error during independent geocoding for "${myLocation}":`, error);
//         // *** REMOVED res.status() here as well ***
//     }
//     console.log("--- End of Independent Geocoding Test ---\n");
// })();
// // --- End of Independent Geocoding Test ---


// app.listen(port ,  ()=>{
//     console.log(`listening at port ${port}`)
// });


// app.post('/api/chat', async (req, res) => {
//     const userMessage = req.body.message;
//     if (!userMessage) { return res.status(400).json({ error: 'Message is required' }); }
//     try {
//         const pythonChatbotResponse = await axios.post(PYTHON_CHATBOT_URL, { message: userMessage });
//         res.json({ reply: pythonChatbotResponse.data.response }); // Remember 'response' is the key from App6.py
//     } catch (error) {
//         console.error('Error communicating with Python chatbot:', error.message);
//         // ... more detailed error handling ...
//         res.status(500).json({ error: 'Failed to get response from chatbot.' });
//     }
// });


// --- ADD THIS NEW ROUTE FOR THE CHAT PAGE ---
// app.get('/chat', (req, res) => {
//     res.render('chat'); // This tells Express to render the 'views/chat.ejs' template
// });
// --- END NEW ROUTE ---

// ... existing app.listen or error handling ...

app.listen(port ,  ()=>{
    console.log(`listening at port ${port}`)
});

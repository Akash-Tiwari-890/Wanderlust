const mongoose = require ("mongoose");
const initdata = require("./data.js"); //Requireing  Data From init /  Data.js
const Listing = require("../models/listing.js");//Requiring Listing form models /Listing.js


const  MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";



main().then(()=>{
    console.log("connected to mongo db")
}).catch((err)=>{
     console.log(err);
});





async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDb =  async ()=>{
    await Listing.deleteMany({}); //Deleteing any data which was erllie 
   initdata.data =  initdata.data.map((obj)=>({...obj , owner: '686f814bf23ac0494f6b8e48'}));//adding the owner to all listing
    await Listing.insertMany(initdata.data) //adding data inti bulk into listing 
    console.log ("DATA WAS INITILI")




};


initDb();

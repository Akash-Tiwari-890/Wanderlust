const schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose"); //requiring passport local mongoose for user authentication         



const userSchema = new Schema({

    email :{
        type:String,
        required:true,

    },
});
userSchema.plugin(passportLocalMongoose);// passsing pasport-local-mongoose as a plugin to userschmea

module.exports = mongoose.model("User" , userSchema); //exporting the user model


//passport-Local-mongoose will add username and password to the user schmea in the form of hash and salt;
const mongoose = require("mongoose");

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("MongoDb connected")
    } catch(err){
        console.log("Error in connecting database",err)
    }
};

module.exports = connectDb;
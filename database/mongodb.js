const mongoose = require("mongoose");
const config = require("../config/env");





const connectDB = async () => {
    try{

        const connect = await mongoose.connect(
            config.DB_URI  //USE CONFIG
        )

        console.log(
            `MongoDB Connected: ${connect.connection.host} - ${connect.connection.name}`
        );


    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
}


module.exports = connectDB;
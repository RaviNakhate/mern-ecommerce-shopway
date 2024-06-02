const mongoose = require('mongoose');

const connection = async() =>{
   mongoose
    .connect(process.env.MONGO_KEY,/*  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } */)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    }); 
}

module.exports = connection;
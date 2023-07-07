const mongoose = require('mongoose');
const { mongoDbUrl } = require('../secret');
const connectDB = async (options ={})=>{
    try {
        await mongoose.connect(mongoDbUrl,options)
        console.log("connected to db successfully");
        mongoose.connection.on('error',(error)=>{
            console.error('db connection error', error)
        });
    } catch (error) {
       console.error('could not connect to db:', error.toString()) 
    }
};

module.exports =connectDB;
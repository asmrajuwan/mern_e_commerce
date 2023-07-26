const mongoose = require('mongoose');
const { mongoDbUrl } = require('../secret');
const logger = require('../controllers/loggerController');
const connectDB = async (options ={})=>{
    try {
        await mongoose.connect(mongoDbUrl,options)
        logger.log('info',"connected to db successfully");
        mongoose.connection.on('error',(error)=>{
            logger.log('error','db connection error:', error)
        });
    } catch (error) {
       logger.log('error','could not connect to db:', error.toString()) 
    }
};

module.exports =connectDB;
const data = require('../data');
const Product = require('../models/productModel');
const User = require('../models/userModel')
const seedUser = async(req,res,next) =>{
    try {
    // deleting all existing user
        await User.deleteMany({})

    // insert all existing users
        const users =await User.insertMany(data.users)
        // successful response
        return res.status(201).json(users);
    } catch (error) {
        next(error)

    };

};

const seedProducts = async(req,res,next) =>{
    try {
        await Product.deleteMany({})
    
        const products =await Product.insertMany(data.products)
        
        return res.status(201).json(products);

    } catch (error) {
        next(error)

    };

};
module.exports={seedUser,seedProducts};
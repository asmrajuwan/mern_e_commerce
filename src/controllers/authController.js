const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtAccessKey } = require('../secret');

const handleLogin = async (req,res,next)=>{
    try {
        const {email,password}= req.body;

        const user= await User.findOne({email});
        
        if(!user){
            throw createError(404,'User does not exist with this id.Please register first')
        };

        const isPassswordMatch =  bcrypt.compare(password, user.password); //await needed
        
        if(!isPassswordMatch){
            throw createError(401,'Email/password did not match');
        }
        
        if(user.isBanned){
            throw createError(40,'You are banned.please contact authority');
        };


        const accessToken=createJSONWebToken
        ({user},
            jwtAccessKey,'15m');
            res.cookie('accessToken',accessToken,{
                maxAge:15*60*1000, //15min
                httpOnly: true,
                // secure:true,
                sameSite: 'none'
            });

            const userWithOutPassword= await User.findOne({email}).select('-password');

        
        return successResponse(res,{
            statusCode:200,
            message:'user logged in successfully',
            payload:{ userWithOutPassword }
           });
           
    } catch (error) {
        next(error)
    }
};


const handleLogout = async (req,res,next)=>{
    try {
        res.clearCookie('access_token')
        
        return successResponse(res,{
            statusCode:200,
            message:'user logged out successfully',
            payload:{}
           });
           
    } catch (error) {
        next(error);
    }
}


module.exports ={handleLogin,handleLogout} 
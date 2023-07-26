const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtAccessKey, jwtRefreshKey } = require('../secret');
const { setAccessTokenCoolie, setRefershTokenCoolie } = require('../helpers/cookie');

const handleLogin = async (req,res,next)=>{
    try {
        const {email,password}= req.body;

        const user= await User.findOne({email});
        
        if(!user){
            throw createError(404,'User does not exist with this id.Please register first')
        };

        const isPassswordMatch = bcrypt.compare(password, user.password); //await needed
        
        if(!isPassswordMatch){
            throw createError(401,'Email/password did not match');
        }
        
        if(user.isBanned){
            throw createError(403,'You are banned.please contact authority');
        };
        
        const accessToken=createJSONWebToken
           ({user},jwtAccessKey,'5m');
            setAccessTokenCoolie(res,accessToken)
            
        const refreshToken=createJSONWebToken
           ({user},jwtRefreshKey,'7d');
            setRefershTokenCoolie(res,refreshToken);

        const userWithOutPassword= user.toObject();
            delete userWithOutPassword.password;

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
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        
        return successResponse(res,{
            statusCode:200,
            message:'user logged out successfully',
            payload:{}
           });
           
    } catch (error) {
        next(error);
    }
}

const handleRefreshToken = async (req,res,next)=>{
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        //verify the old refrsh token
        const decodedToken = jwt.verify(oldRefreshToken,jwtRefreshKey);
        if(!decodedToken){
            throw createError(401,'Invalid refresh token.Please login again')
        };

        const accessToken=createJSONWebToken
        (decodedToken.user,
            jwtAccessKey,'5m');
          
          setAccessTokenCoolie(res,accessToken);
            // res.cookie('accessToken',accessToken,{
            //     maxAge:5*60*1000, //15min
            //     httpOnly: true,
            //     //secure:true,
            //     sameSite: 'none'
            // });

        return successResponse(res,{
            statusCode:200,
            message:'new access token is generated',
            payload:{}
           });
           
    } catch (error) {
        next(error);
    }
};

const handleProtectedRoute = async (req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;
        //verify the old refrsh token
        const decodedToken = jwt.verify(accessToken,jwtAccessKey);
        if(!decodedToken){
            throw createError(401,'Invalid access token.Please login again')
        };

           

        return successResponse(res,{
            statusCode:200,
            message:'protected resources accessed successfully',
            payload:{}
           });
           
    } catch (error) {
        next(error);
    }
}

module.exports ={handleLogin,
                handleLogout,
                handleRefreshToken,
                handleProtectedRoute
                } 
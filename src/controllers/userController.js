const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findWithId');
const { deleteImage } = require('../helpers/deleteImage');
const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtActivationKey, clientUrl, jwtResetPasswordKey } = require('../secret');
const emailWithNodeMail = require('../helpers/email');
// const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypts = require('bcrypt');
const bcrypt = require('bcryptjs');
const checkUserExists = require('../helpers/checkUserExists');
const sendEmail = require('../helpers/sendEmail');


const getUsers= async(req,res,next)=>{
    try{
        const search = req.query.search ||"";
        const page= Number(req.query.page) ||1;
        const limit= Number(req.query.limit) ||5;

        const searchRegExp = new RegExp('.*' + search + '.*','i');
        const filter ={
            isAdmin:{$ne:true},
                    $or:[
                        {name:{$regex: searchRegExp}},
                        {email:{$regex: searchRegExp}},
                        {phone:{$regex: searchRegExp}},
                    ]
        };

        const options ={password: 0};

 
        const users =await User.find(filter,options)
        .limit(limit)
        .skip((page-1)*limit);

        const count = await User.find(filter).countDocuments();

        if(!users || users.length === 0) throw createError(404,'no users found');
       return successResponse(res,{
        statusCode:200,
        message:'user profile is returned',
        payload:{
            users,
            pagination:{
                totalPages: Math.ceil(count/limit),
                currentPage: page,
                previousPage: page-1 > 0 ? page-1:null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page+1 :null,
            }
        }
       });
       
    }
    catch(error){
        next(error)

    }
};

const getUserById = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const options ={password:0}
        
        const user = await findWithId(User,id,options);

        return successResponse(res,{
            statusCode:200,
            message:'user is returned',
            payload:{user}
        })
    } catch (error) {
        
        next(error)
    }
}

const deleteUserById = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const options ={password:0}

        await findWithId(User,id,options);
        
        // const userimagePath =user.image;

        // deleteImage(userimagePath);

        
        await User.findByIdAndDelete({
            _id:id,
            isAdmin:false,
        })

        return successResponse(res,{
            statusCode:200,
            message:'user is deleted',
           
        })
    } catch (error) {
        
        next(error)
    }
}

const processRegister = async (req,res,next)=>{
    try {
       const {name,email,password,phone,address} = req.body;
       console.log(name)
       
       const image =req.file;

       if(!image){
            throw createError(400,'Image file is required')
       }

       if(image.size>1024*1024*2){
        throw createError(400,'Image file is too large.it must be less then 2mb')
   }

       const imageBUfferString =image.buffer.toString('base64');

       const userExists = await checkUserExists(email);

       if(userExists) {
        throw createError(409,'user with this email already registered')
       }

       const token=createJSONWebToken(
        {name,email,password,phone,address,image:imageBUfferString},jwtActivationKey,'10m');
       console.log(token);

       //PREPARE EMAIL
       const emailData = {
        email,
        subject:'account activation email',
        html:`
            <h2>Hello ${name} !</h2> 
            <p>please click here to <a href="${clientUrl}/api/users/activate/${token} target="_blank"">activate your account<a></p>
        `}

       //send email with nodemailer
        
        sendEmail(emailData);
        return successResponse(res,{
            statusCode:200,
            message:`please go to your ${email} for completing your reg process`,
        })
    } catch (error) {
        
        next(error)
    }
};

const activateUserAccount = async (req,res,next)=>{
    try {
      const token =req.body.token;
      if (!token) throw createError(404,"token not found");
        
      try {
        const decoded = jwt.verify(token,jwtActivationKey);
        if (!decoded) throw createError(401,"unable to verify user");

        const userExists = await User.exists({email:decoded.email});
        
        if(userExists) {
        throw createError(409,'user with this email already registered')
       }
        
        await User.create(decoded);

        return successResponse(res,{
            statusCode:201,
            message:"user registered successfuy",
            })

      } catch (error) {

        if(error.name==='TokenExpiredError'){
            throw createError(401,'token has experied');
        }
        else if(error.name==='JsonWebTokenError'){
            throw createError(401,'invalid token')
        } else{
            throw error;
        }
    } } catch (error) {
         next(error)
    }
};

const updateUserById = async (req,res,next)=>{ 
    try {
        const userId = req.params.id;

        const options ={password:0}
         await findWithId(User,userId,options).select('-password');

        const updateOptions ={new: true, runValidators: true,
            context:'query'}
            
            let updates ={};
            const allowedFields = ['name','password','phone','address'];
            for(const key in req.body){
                if(allowedFields.includes(key)){
                    updates[key]=req.body[key];
                }
                else if(key ==='email'){
                    throw createError(400,'email cant be updated')
                }
            }

        const image = req.file;

        if(image){
            if(image.size>1024*1024*2){
                throw createError(400,'Image file is too large.it must be less then 2mb')
           } 
           updates.image= image.buffer.toString('base64');
        }

        // delete.updates.email;

        const updateUser = await User.findByIdAndUpdate(
            userId, updates, updateOptions).select('-password')

        if(!updateUser){
            
                throw createError(404,'user with this id does not exist')
           
        }

    return successResponse(res,{
            statusCode:200,
            message:'user is updated',
            payload:updateUser,
           
        })
    } catch (error) {
        
        next(error)
    }
}

const handleBanUserById = async (req,res,next)=>{ 
    try {
        const userId = req.params.id;
        await findWithId(User,userId);
        const updates ={isBanned:true};
        const updateOptions ={new: true, runValidators: true,
            context:'query'};
            
        
        // delete.updates.email;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            updates,    //{isBanned:true}
            updateOptions).select('-password');

        if(!updateUser){
            
                throw createError(400,'user was not banned successfully')
            }

    return successResponse(res,{
            statusCode:200,
            message:'user was banned successfully',
           })
    } catch (error) {
        
        next(error)
    }
};

const handleUnbanUserById = async (req,res,next)=>{ 
    try {
        const userId = req.params.id;
        await findWithId(User,userId);
        const updates ={isBanned:false};
        const updateOptions ={new: true, runValidators: true,
            context:'query'};
            
        
        // delete.updates.email;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            updates,    //{isBanned:true}
            updateOptions).select('-password');

        if(!updateUser){
            
                throw createError(400,'user was not unbanned successfully')
            }

    return successResponse(res,{
            statusCode:200,
            message:'user was unbanned successfully',
           })
    } catch (error) {
        
        next(error)
    }
};

const handleUpdatePassword = async (req,res,next)=>{ 

    try {
        let {email,oldPassword,newPassword,confirmPassword}= req.body;
        const userId = req.params.id;
        const user= await findWithId(User,userId);
        
        let isPassswordMatch = await bcrypt.compare(oldPassword,user.password); //await needed
    
        if(!isPassswordMatch){
            throw createError(400,'old password is incorrect');
        }
        
        // const filter ={userId};
        // const updates ={$set: {password: newPassword}};
        // const updateOptions ={new:true};

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {password: newPassword},
            {new:true}
            ).select('-password');

        if(!updateUser){
            throw createError(400,'user was not updated successfully')
            }

    return successResponse(res,{
            statusCode:200,
            message:'user was updated successfully',
            payload:{updateUser}
           })
    } catch (error) {
        next(error)
    }
};

const handleForgetPassword = async (req,res,next)=>{ 

    try {
        const {email}= req.body;
        const userData = await User.findOne({email:email});

        if(!userData){
            throw createError(404,'Email is incorrect or you have not varified your email address. please register yourself first')
        }

        const token=createJSONWebToken(
            {email},jwtResetPasswordKey,'10m');
           console.log(token);
    
           //PREPARE EMAIL
           const emailData = {
            email,
            subject:'Reset password Email',
            html:`
                <h2>Hello ${userData.name} !</h2> 
                <p>please click here to <a href="${clientUrl}/api/users/reset-password/${token} target="_blank"">Reset your password<a></p>
            `}
    
           //send email with nodemailer
        //   try {
        //     await emailWithNodeMail(emailData)
    
        //   } catch (emailError) {
        //     next(createError(500,'faild to send reset password email'))
        //     return;
        //   }
        sendEmail(emailData);
            return successResponse(res,{
                statusCode:200,
                message:`Please go to your ${email} to reset  your password`,
                payload:{token},
               
            })
    } catch (error) {
        next(error)
    }
};
const handleResetPassword = async (req,res,next)=>{ 

    try {
        const {token,password} = req.body;
        const decoded =jwt.verify(token,jwtResetPasswordKey);
        if(!decoded){
            throw createError(400,'Invalid or expired token')
        }
        const filter ={email: decoded.email};
        const update ={password: password};
        const options ={ new: true}
        const updateUser = await User.findOneAndUpdate(
            filter,
            update,
            options
            ).select('-password');

        if(!updateUser){
            throw createError(400,'Password reset failed')
            }


    return successResponse(res,{
            statusCode:200,
            message:'Password reset successfully',
            
           })
    } catch (error) {
        next(error)
    }
};

        module.exports ={getUsers,
                    getUserById,
                    deleteUserById, 
                    processRegister,
                    activateUserAccount,
                    updateUserById,
                    handleBanUserById,
                    handleUnbanUserById,
                    handleUpdatePassword,
                    handleForgetPassword,
                    handleResetPassword};
const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findWithId');
const { deleteImage } = require('../helpers/deleteImage');
const { createJSONWebToken } = require('../helpers/jsonwebtoken');
const { jwtActivationKey, clientUrl } = require('../secret');
const emailWithNodeMail = require('../helpers/email');
// const fs = require('fs').promises;
const jwt = require('jsonwebtoken');




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

        if(!users) throw createError(404,'no users found');
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

        const user = await findWithId(User,id,options);
        
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
       
       const image =req.file;

       if(!image){
            throw createError(400,'Image file is required')
       }

       if(image.size>1024*1024*2){
        throw createError(400,'Image file is too large.it must be less then 2mb')
   }

       const imageBUfferString =image.buffer.toString('base64');

       const userExists = await User.exists({email:email});

       if(userExists) {
        throw createError(409,'user with this email already registered')
       }

       const token=createJSONWebToken({name,email,password,phone,address,image:imageBUfferString},jwtActivationKey,'10m');
       console.log(token);

       //PREPARE EMAIL
       const emailData = {
        email,
        subject:'account activation email',
        html:`
            <h2>Hello ${name} !</h2> 
            <p>please click here to <a href="${clientUrl}/api/users/activate/${token} target="_blank"">activate your account<a></p>
        `
       }

       //send email with nodemailer
      try {
        await emailWithNodeMail(emailData)

      } catch (emailError) {
        next(createError(500,'faild to send varification email'))
        return;
      }
        return successResponse(res,{
            statusCode:200,
            message:`please go to your ${email} for completing your reg process`,
            payload:{token,imageBUfferString},
           
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
        
      }


       
    } catch (error) {
        
        next(error)
    }
};

const updateUserById = async (req,res,next)=>{ 
    try {
        const userId = req.params.id;

        const options ={password:0}
         await findWithId(User,userId,options).select("-password");

        const updateOptions ={new: true, runValidators: true,
            context:'query'}
            
            let updates ={};

            for(let key in req.body){
                if(['name','password','phone','address'].includes(key)){
                    updates[key]=req.body[key];
                }
                else if(['email'].includes(key)){
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

        const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions)

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

module.exports ={getUsers,getUserById,deleteUserById, processRegister,activateUserAccount,updateUserById};
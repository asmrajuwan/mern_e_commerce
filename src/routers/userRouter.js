const express = require('express');
const { router } = require('../app');
const { getUsers,getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById } = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../vaidators/auth');
const runValidation = require('../vaidators');
const {isLoggedIn, isLoggedOut, isAdmin} = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post('/process-register',upload.single("image"),isLoggedOut,validateUserRegistration,runValidation,  processRegister);
userRouter.post('/activate',isLoggedOut, activateUserAccount);

userRouter.get('/',isLoggedIn,isAdmin,getUsers );
userRouter.get('/:id',isLoggedIn,getUserById );
userRouter.delete('/:id',isLoggedIn,deleteUserById );
userRouter.put('/:id',upload.single("image"),isLoggedIn,updateUserById);


module.exports =userRouter;
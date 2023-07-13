const express = require('express');
const { router } = require('../app');
const { getUsers,getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById, handleBanUserById, handleUnbanUserById, handleUpdatePassword, handleForgetPassword, handleResetPassword } = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration, validateUserPasswordUpdate, validateUserForgetPassword, validateUserResetPassword } = require('../vaidators/auth');
const runValidation = require('../vaidators');
const {isLoggedIn, isLoggedOut, isAdmin} = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post('/process-register',upload.single("image"),isLoggedOut,validateUserRegistration,runValidation,  processRegister);
userRouter.post('/activate',isLoggedOut, activateUserAccount);

userRouter.get('/',isLoggedIn,isAdmin,getUsers );
userRouter.get('/:id([0-9a-fA-F]{24})',isLoggedIn,getUserById );
userRouter.delete('/:id([0-9a-fA-F]{24})',isLoggedIn,deleteUserById );
userRouter.put('/reset-password/',validateUserResetPassword,runValidation,handleResetPassword);
userRouter.put('/:id([0-9a-fA-F]{24})',upload.single("image"),isLoggedIn,updateUserById);
userRouter.put('/ban-user/:id([0-9a-fA-F]{24})',isLoggedIn,isAdmin,handleBanUserById);
userRouter.put('/unban-user/:id([0-9a-fA-F]{24})',isLoggedIn,isAdmin,handleUnbanUserById);
userRouter.put('/update-password/:id([0-9a-fA-F]{24})',validateUserPasswordUpdate,runValidation,isLoggedIn,handleUpdatePassword);
userRouter.post('/forget-password/',validateUserForgetPassword,runValidation,handleForgetPassword);





module.exports =userRouter;
const express = require('express');
const runValidation = require('../vaidators');
const { handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const { validateUserLogin, validateRefreshToken } = require('../vaidators/auth');
const authRouter = express.Router();

authRouter.post('/login',validateUserLogin,runValidation,isLoggedOut, handleLogin);
authRouter.post('/logout',isLoggedIn,handleLogout);
authRouter.get('/refresh-token', handleRefreshToken);
authRouter.get('/protected', handleProtectedRoute);





module.exports=authRouter;
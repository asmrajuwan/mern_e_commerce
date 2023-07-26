const express = require('express');


const runValidation = require('../vaidators');
const {isLoggedIn,
    isLoggedOut, 
    isAdmin} = require('../middlewares/auth');
const { handleCreateCategory } = require('../controllers/categoryController');
const { validateCategory } = require('../vaidators/category');
const categoryRouter = express.Router();

categoryRouter.post('/',validateCategory,runValidation,isLoggedIn,isAdmin, handleCreateCategory);


module.exports =categoryRouter;
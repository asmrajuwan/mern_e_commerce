const express = require('express');


const runValidation = require('../vaidators');
const {isLoggedIn,
    isLoggedOut, 
    isAdmin} = require('../middlewares/auth');
const { handleCreateCategory, handleGetCategory, handleGetCategories, handleUpdateCategory } = require('../controllers/categoryController');
const { validateCategory } = require('../vaidators/category');
const categoryRouter = express.Router();

categoryRouter.post('/',
    validateCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateCategory);

categoryRouter.get('/', handleGetCategories);
categoryRouter.get('/:slug', handleGetCategory)
categoryRouter.put('/:slug',validateCategory,
runValidation,
isLoggedIn,
isAdmin, handleUpdateCategory)
    


module.exports =categoryRouter;
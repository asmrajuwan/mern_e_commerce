const express = require('express');

const upload = require('../middlewares/uploadFile');const {isLoggedIn,
    isLoggedOut, 
    isAdmin} = require('../middlewares/auth');
const { handleCreateProduct, handleGetProducts } = require('../controllers/productController');
const { validateProduct } = require('../vaidators/product');
const runValidation = require('../vaidators');
const productRouter = express.Router();




productRouter.post('/',upload.single("image"),validateProduct,runValidation,isLoggedIn,isAdmin, handleCreateProduct
);

productRouter.get('/', handleGetProducts);

module.exports =productRouter;

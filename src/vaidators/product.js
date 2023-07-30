const {body} = require('express-validator');

const validateProduct =[
    body("name")
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({min:3,max:150})
    .withMessage('Product name should  be at least 3-150 characters long'),
    body("description")
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({min:3})
    .withMessage('Product description should  be at least 3 characters long'),
    body("price")
    .trim()
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({min:0})
    .withMessage('Price must be a positive number'),
    body("category")
    .trim()
    .notEmpty()
    .withMessage('Product category is required'),
    body("quantity")
    .trim()
    .notEmpty()
    .withMessage('Product quantity is required')
    .isInt({min:1})
    .withMessage('Quantity must be a positive number'),
    
    
   
];

module.exports= {validateProduct};
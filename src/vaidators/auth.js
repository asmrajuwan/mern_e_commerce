const {body} = require('express-validator');

// registration validation
const validateUserRegistration =[
    body("name")
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({min:3,max:31})
    .withMessage('name should  be at least 3-31 characters long'),
    body("email")
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email address'),
    body("password")
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({min:6})
    .withMessage('password should be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/
    )
    .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
    body("address")
    .trim()
    .notEmpty()
    .withMessage('address is required')
    .isLength({min:3})
    .withMessage('adress should be at least 3 characters long'),
    body("phone")
    .trim()
    .notEmpty()
    .withMessage('phone is required'),
    body("image")
    .custom((value,{req})=>{
        if(!req.file||!req.file.buffer){
            throw new Error('user image is required');
        }
        return true;
    })

    .withMessage('user image is required')
    
];

const validateUserLogin =[
    body("email")
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email address'),
    body("password")
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({min:6})
    .withMessage('password should be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/
    )
    .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
    ];


module.exports= {validateUserRegistration,validateUserLogin};
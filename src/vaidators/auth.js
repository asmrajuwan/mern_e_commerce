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
    
    body("address")
    .trim()
    .notEmpty()
    .withMessage('address is required')
    .isLength({min:3})
    .withMessage('adress should be at least 3 characters long'),
    
    body("password")
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({min:6})
    .withMessage('password should be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
   
    body("phone")
    .trim()
    .notEmpty()
    .withMessage('phone is required'),
    
    body("image")
    .optional().isString().withMessage('User image is optional'),
    
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
    ];

    const validateUserPasswordUpdate =[
        
        body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage('old password is required')
        .isLength({min:6})
        .withMessage('old password should be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
        .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
        body("newPassword")
        .trim()
        .notEmpty()
        .withMessage('new password is required')
        .isLength({min:6})
        .withMessage('new password should be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
        .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
        body('confirmPassword').custom((value,{req})=>{
            if(value !== req.body.newPassword){
            throw new Error('Pass did not match')   
            }
            return true
        })
    ];

    const validateUserForgetPassword =[
        body("email")
        .trim()
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('Invalid email address')];

    const validateUserResetPassword =[
            body("token")
            .trim()
            .notEmpty()
            .withMessage('token is required'),
            body("password")
            .trim()
            .notEmpty()
            .withMessage('password is required')
            .isLength({min:6})
            .withMessage('password should be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
            .withMessage('password should be conatain at least one uppercase letter,one lowercase letter,one number and one special character'),
           
        ];

        // const validateRefreshToken =[
        //     body("token")
        //     .trim()
        //     .notEmpty()
        //     .withMessage('token is required'),
           
        // ];


module.exports= {validateUserRegistration,
    validateUserLogin,
    validateUserPasswordUpdate,
    validateUserForgetPassword,
validateUserResetPassword};
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const cookieParser = require('cookie-parser');
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

const app = express();

const keyGenerator = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const limiter = rateLimit({
  keyGenerator: keyGenerator,
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 150 requests per minute
  message: 'Too many requests',
});

app.use(cookieParser());
app.use(limiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);


app.get('/test', (req, res) => {
  res.status(200).send({ message: 'API testing is working fine' });
});

app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;



// const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const createError = require("http-errors");
// const xssClean = require('xss-clean');
// const rateLimit = require('express-rate-limit');
// const userRouter = require("./routers/userRouter");
// const seedRouter = require("./routers/seedRouter");
// const { errorResponse } = require("./controllers/responseController");
// const authRouter = require("./routers/authRouter");
// const cookieParser = require('cookie-parser');

// const app = express();
// // Define the custom keyGenerator function
// const keyGenerator = (req) => {
//     return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   };
  
//   // Configure rate limiting with the custom keyGenerator
//   const limiter = rateLimit({
//     keyGenerator: keyGenerator,
//     // Other rate limit options...
//   });
  
//   // Apply the rate limiter middleware to your routes
 

// const rateLimiter = rateLimit({
// 	windowMs: 1 * 60 * 1000, // 1 minutes
// 	max: 150, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
// 	message:'Too many request',
// })
// app.use(cookieParser())
// app.use(limiter);
// app.use(rateLimiter)

// app.use(xssClean());
// app.use(morgan("dev"))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.use("/api/users",userRouter);
// app.use("/api/seed",seedRouter);
// app.use("/api/auth",authRouter);


// app.get('/test', (req,res)=>{
//     res.status(200).send({message:'api testing is working fine'})
// });


// // client error handling 
// app.use((req,res,next)=>{
//     next(createError(404,'route not found'))
// });

// // server error handling -> all error handles
// app.use((err,req,res,next)=>{
//     return errorResponse(res,{
//         statusCode:err.status,
//         message:err.message,
//     })
// });


// module.exports = app;
const jwt = require('jsonwebtoken');

const createJSONWebToken =(payload,secretKey,expiresIn)=>{

    if(typeof payload !== 'object'|| !payload){
        throw new Error ('payloaad must be non-empty object');
    }

    if(typeof secretKey !== 'string'|| secretKey ===""){
        throw new Error ('secretKey must be non-empty string');
    }
    try {
        const token = jwt.sign(payload, secretKey,{expiresIn});
        return token;
        
    } catch (error) {
        console.error('faild to sign the jwt:',err);
        throw err;
        
    }
   
};
module.exports= {createJSONWebToken};
const User = require("../models/userModel");

const checkUserExists = async (email)=>{
   return userExists = await User.exists({email:email});

}
module.exports = checkUserExists;
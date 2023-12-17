const {Schema,model} =require('mongoose')
const bcrypt = require ('bcryptjs');
const { defaultImagePath } = require('../secret');

const userSchema = new Schema({
    name:{
        type: String,
        required:[true,'user name is missing'],
        trim: true,
        maxlength:[31,'Username length  can be max 31 character'],
        minlength:[3,'Username length can be min 3 character']
    },
    email:{
        type: String,
        required:[true,'email is required'],
        trim: true,
        uniquie:true,
        lowercase:true,
        validate:{
            validator: (v)=>{
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
                 
            },
            message:'please enter a valid email'
        }
        },
    password:{
        type: String,
        required:[true,'Password name is missing'],
        minlength:[6,'password length must be min 6 character'],
        set:(v)=>bcrypt.hashSync(v, bcrypt.genSaltSync(10))

        },
    image:{
        type: String,
        default:defaultImagePath,
        required:[true,'user image is required']
        },
    address:{ 
        type:String,
        required:[true,'user address required'],
        minlength:[3,'adress length must be min 3 character']

        },
    
    phone:{
          type: String,
          required:[true,"phone number required"]  
        },
        isAdmin:{
           type: Boolean,
           default:false 
        },
    isBanned:{
            type:Boolean,
            default:false
        },
        
},{timestamps:true});

const User = model('Users', userSchema);

module.exports=User;
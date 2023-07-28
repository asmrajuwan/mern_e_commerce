const {Schema,model} =require('mongoose')



const productShcema = new Schema({
    name:{
        type: String,
        required:[true,'Product name is required'],
        trim: true,
        minlength:[3,'Product name length can be min 3 characters'],
        maxlength:[150,'Product name length can be max 150 characters']

    },
    slug:{
        type: String,
        required:[true,'Product slug is missing'],
        lowercase: true,
        uniquie:true
        },

    description:{
        type: String,
        required:[true,'Product description is required'],
        trim:true,
        lowercase: true,
        uniquie:true,
        minlength:[3,'Product description length can be min 3 characters'],

        
    },

    price:{
        type: Number,
        required:[true,'Product price is required'],
        trim:true,
        lowercase: true,
        validate:{
            validator:(v)=> v > 0,
                
            message: (props) =>
                `${props.value} is not a valid price! price mus t be greater than zero`
            
        }
        
    },

    quantity:{
        type: Number,
        required:[true,'Product quantity is required'],
        trim:true,
        lowercase: true,
        validate:{
            validator:(v)=> v > 0,
                
            message: (props) =>
                `${props.value} is not a valid quantity! quantity must be greater than zero`
            
        }
        
    },

    sold:{
        type: Number,
        required:[true,'Sold quantity is required'],
        trim:true,
        default:0,
        lowercase: true,
    },

    shipping:{
        type: Number,
        default:0 //shipping free 0 or paid some amount
    },

    image:{
        type: Buffer,
        contentType:String,
        required:[true,'Product image is required']
    },

    category:{
        type: Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }


},
{timestamps:true}
);


const Product = model('Product', productShcema);

module.exports=Product;
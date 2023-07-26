const {Schema,model} =require('mongoose')



const CategoryShcema = new Schema({
    name:{
        type: String,
        required:[true,'Category name is missing'],
        trim: true,
        uniquie:true,
        minlength:[3,'Username length can be min 3 character']
    },
    slug:{
        type: String,
        required:[true,'Category slug is missing'],
        lowercase: true,
        uniquie:true,
        
    },

},
{timestamps:true}
);


const Category = model('Category', CategoryShcema);

module.exports=Category;
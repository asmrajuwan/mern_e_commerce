const slugify = require('slugify')
const Product = require('../models/productModel');
const createError = require('http-errors');

const createProduct = async (productData)=>{
    const {name,
            description,
            price,
            quantity,
            shipping,
            category,
            imageBUfferString} = productData;

    const productExists = await Product.exists({name:name});

    if(productExists) {
        throw createError(409,'Product with this name already exist')
        }

       //create product
    const product = await Product.create({
        name:name,
        slug:slugify(name),
        description: description,
        price:price,
        quantity:quantity,
        shipping:shipping,
        image:imageBUfferString,
        category:category
       });
       return product
};

const getProducts = async (page=1,limit=4,filter={})=>{
    const products = await Product.find(filter)
    .populate('category')
    .skip((page-1)* limit)
    .limit(limit)
    .sort({createdAt: -1});
     if(!products) throw createError(404,'no product found')
     
     const count = await Product.find(filter).countDocuments();

     return {products,
        count,
        totalpages:Math.ceil(count/limit),
        };
};

const getProduct = async (slug)=>{
   
     const product = await Product.findOne({slug}).populate('category')

     if(!product) throw createError(404,'no product found')
     
     return {product};
};

const deleteProduct = async (slug)=>{
   
    const product = await Product.findOneAndDelete({slug})

    if(!product) throw createError(404,'no product found')
    
    return {product};
};

const updateProductBySlug = async (slug,updates,image,updateOptions)=>{
    
    if(updates.name){
                updates.slug =slugify(updates.name);
            }
    if(image){
        if(image.size>1024*1024*2){
            throw createError(400,'Image file is too large.it must be less then 2mb')
    } 
    updates.image= image.buffer.toString('base64');
}



    const updatedProduct = await Product.findOneAndUpdate(
    {slug}, updates, updateOptions)

    if(!updatedProduct){
        
            throw createError(404,'user with this id does not exist')
    
    }
    return updatedProduct

};




module.exports ={createProduct,getProducts,getProduct,deleteProduct,updateProductBySlug}
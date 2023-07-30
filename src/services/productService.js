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

const getProducts = async (page=1,limit=4)=>{
    const products = await Product.find({})
    .populate('category')
    .skip((page-1)* limit)
    .limit(limit)
    .sort({createdAt: -1});
     if(!products) throw createError(404,'no product found')
     
     const count = await Product.find({}).countDocuments();

     return {products,
        count,
        totalpages:Math.ceil(count/limit),
        };
};





module.exports ={createProduct,getProducts}
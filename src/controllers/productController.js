const createError = require("http-errors");
const slugify = require('slugify')
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findWithId");
const Product = require("../models/productModel");
const { createProduct, getProducts, getProduct, deleteProduct, updateProductBySlug } = require("../services/productService");

const handleCreateProduct = async (req,res,next)=>{
    try {
       const {name,description,price,quantity,shipping,category} = req.body;
       
       const image =req.file;

       if(!image){
            throw createError(400,'Image file is required')
       }

       if(image.size>1024*1024*2){
        throw createError(400,'Image file is too large.it must be less then 2mb')
   }

       const imageBUfferString =image.buffer.toString('base64');

       const productData = {name,description,price,quantity,shipping,category, imageBUfferString}


       const product= await createProduct(productData);

      return successResponse(res,{
            statusCode:200,
            message:'Product was created successfully',
            payload: product 
        })
    } catch (error) {
        
        next(error)
    }
};

const handleGetProducts = async (req,res,next)=>{
    try {
       const page = parseInt(req.query.page )|| 1;
       const limit = parseInt(req.query.limit) || 4;

       const productsData = await getProducts(page,limit)

        return successResponse(res,{
            statusCode:200,
            message:'returned all the  products',
             payload:{
                products:productsData.products,
                pagination:{
                    totalPages: productsData.totalpages,
                    currentPage: page,
                    previousPage:page-1,
                    nextPage:page+1,
                    totalNumberOfProducts : productsData.count
                }
            }
        })
    } catch (error) {
        
        next(error)
    }
};

const handleGetProduct = async (req,res,next)=>{
    try {
       
        const {slug} = req.params;

        const product = await getProduct(slug)
       
        return successResponse(res,{
            statusCode:200,
            message:'returned single  product',
             payload: {product}
        })
    } catch (error) {
        
        next(error)
    }
};
const handleDeleteProduct = async (req,res,next)=>{
    try {
       
        const {slug} = req.params;

        const product = await deleteProduct(slug)
       
        return successResponse(res,{
            statusCode:200,
            message:'product deleted',
             
        })
    } catch (error) {
        
        next(error)
    }
};

const handleUpdateProduct = async (req,res,next)=>{ 
    try {
        const {slug} = req.params;

        const updateOptions ={new: true, runValidators: true,
            context:'query'}
            
            let updates ={};
            
            const allowedFields = ['name','description','price','sold','quantity','shipping'];

            for (const key in req.body){
                if(allowedFields.includes(key)){
                    updates[key]=req.body[key];
                }
                // else if(key ==='email'){
                //     throw createError(400,'email cant be updated')
                // }
            }

            const image = req.file;

            const updatedProduct = await updateProductBySlug(slug,updates,image,updateOptions)

    return successResponse(res,{
            statusCode:200,
            message:'Product is updated successfully',
            payload:updatedProduct,
           
        })
    } catch (error) {
        
        next(error)
    }
}

module.exports ={
    handleCreateProduct,
    handleGetProducts,
    handleGetProduct,
    handleDeleteProduct,
    handleUpdateProduct}